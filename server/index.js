const { PrismaClient } = require('@prisma/client')
const { Client } = require('pg')
const prisma = new PrismaClient()
const WebSocket = require('ws')
const pgClient = new Client({
    connectionString: "postgresql://postgres:Vanessa97723$@localhost:5432/hobbydata?schema=public"
})
require('dotenv').config();
var cors = require('cors')
const express = require('express')
const bcrypt = require('bcrypt');
const saltRounds = 14;
const app = express()
const job = require('./cronJob')
const PORT = 3000
const wss = new WebSocket.Server({ port: 8080 }, () => {
    console.log("Websocket server is running on ws://localhost:8080")
})

app.use(express.json());
app.use(cors());
job.start()
const clients = {}
pgClient.connect()

pgClient.query('LISTEN new_user')
pgClient.query('LISTEN new_post')

pgClient.on('notification', async (msg) => {
    const payload = JSON.parse(msg.payload)
    const data = {
        type: msg.channel,
        ...payload,
    }
    const handleMsgChannelNotification = async (notifications, usersToNotify) => {
        await prisma.notification.createMany({
            data: notifications,
        })

        usersToNotify.forEach(user => {
            const client = clients[user.id]
            if (client && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data))
            }
        })
    }


    if (msg.channel === 'new_user') {
        const { hobbyId, username } = payload;
        const usersToNotify = await prisma.user.findMany({
            where: { hobbyId, username: {not: username} },
        })

        const notifications = usersToNotify.map(user => ({
            type: 'new_user',
            message: `New User: ${username}`,
            userId: user.id
        }))
        handleMsgChannelNotification(notifications, usersToNotify)

    } else if (msg.channel === 'new_post'){
        const { hobbyId, caption, username } = payload;
        const usersToNotify = await prisma.user.findMany({
            where: { hobbyId, username: {not: username}  },
        })

        const notifications = usersToNotify.map(user => ({
            type: 'new_post',
            message: `New Post: ${caption}`,
            userId: user.id
        }))

        handleMsgChannelNotification(notifications, usersToNotify)
    }
})

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const { userId } = JSON.parse(message)
        clients[userId] = ws
    })

    ws.on('error', (e) => {
        console.error("error on ws", e);
    })
    ws.on('close', () => {
        Object.keys(clients).forEach(key => {
            if (clients[key] === ws) {
                delete clients[key]
            }
        })
    })
})

// NOTIFICATONS


app.get("/", async (req, res) => {
    const users = await prisma.user.findMany()
    res.json(users)
})

app.get('/notifications/:userId', async (req,res) => {
    const { userId } = req.params
    const notifications = await prisma.notification.findMany({
        where: { userId: parseInt(userId) },
        orderBy: { createdAt: 'desc'}
    })
    res.json(notifications)
})

app.post("/create", async (req, res) => {
    const {user, password, first, last } = req.body;

    bcrypt.hash(password, saltRounds, async function(err, hashed) {
        if (err) {
            console.error("error hashing")
            return res.status(500)
        }
        try {
            const createdUser = await prisma.user.create({
                data : { 
                    username: user,
                    hashedPassword: hashed,
                    firstname: first,
                    lastname: last
                }
            });
            res.status(200).json(createdUser);
        } catch (e) {
            console.error(e);
        }
    });
})

app.post("/login", async (req, res) => {
    const {user, password} = req.body;
    const userRecord = await prisma.user.findUnique({
        where : { username: user }
    });

    bcrypt.compare(password, userRecord.hashedPassword, function(err, result) {
        if (result) {
            res.status(200);
            return res.json(userRecord)
        } else {
            res.status(500).json({"error": err});
        }
    });
})

app.post("/:username/profile-setup", async (req, res) => {
    const { username } = req.params
    const {bio, pronouns, pfp} = req.body
    try {
        const updatedUser = await prisma.user.update({
            where: { username: username },
            data: {
                bio: bio,
                pronouns: pronouns,
                pfp: pfp
            },
        })
        return res.json(updatedUser.id)
    } catch (error) {
        console.error(error)
        res.status(500)
    }
})

app.post("/:username/interests", async (req, res) => {
    const { username } = req.params
    const { interests } = req.body
    try {
        const user = await prisma.user.findUnique({
            where: { username: username },
        })
        if (!user) {
            res.status(404)
        }
        const interestsToAdd = interests.filter(
            (interest) => !user.interests.includes(interest)
        )
        const newInterests = [...user.interests, ...interestsToAdd]
        const updatedUser = await prisma.user.update({
            where: { username: username },
            data: {
                interests: newInterests
            },
        })
        res.json(updatedUser)
    } catch (error) {
        res.status(500)
    }
})

app.get("/get-hobbies", async (req, res) => {
    const hobbies = await prisma.hobby.findMany()
    res.json(hobbies)
})

app.get("/:username/get-user", async (req, res) => {
    const { username } = req.params
    const currentUser = await prisma.user.findUnique({
        where: {username: username}
    })

    res.json(currentUser)
})

app.get("/:username/get-interests", async (req, res) => {
    const { username } = req.params
    const user = await prisma.user.findUnique({
        where: { username: username },
        select: { interests: true },
    })
    if (!user) {
        return res.status(404)
    }
    res.json(user.interests)
})

app.post("/:username/update-hobby/:hobbyId", async (req, res) => {
    const { username, hobbyId } = req.params
    const updatedUser = await prisma.user.update({
        where: { username: username },
        data: {
            hobbyId: parseInt(hobbyId)
        },
    })
    return res.json(updatedUser)        
})

app.get("/:username/get-hobbyId", async (req, res) => {
    const { username } = req.params
    try {
        const user = await prisma.user.findUnique({
            where: { username: username },
            select: { hobbyId: true },
        })
        if (!user) {
            return res.status(404)
        }
        res.json(user.hobbyId)
    } catch (error) {
        console.error(error)
        res.status(500)
    }
})

app.get("/:hobbyId/posts", async (req, res) => {
    const { hobbyId } = req.params
    try {
        const hobby = await prisma.hobby.findUnique({
            where: { id: parseInt(hobbyId) },
            select: { posts: true },
        })
        if (!hobby) {
            return res.status(404)
        }
        res.json(hobby.posts)
    } catch (error) {
        console.error(error)
        res.status(500)
    }
})

app.get("/:hobbyId/get-hobby", async (req, res) => {
    const { hobbyId } = req.params
    try {
        const hobby = await prisma.hobby.findUnique({
            where: { id: parseInt(hobbyId) },
        })
        if (!hobby) {
            return res.status(404)
        }
        res.json(hobby)
    } catch (error) {
        console.error(error)
        res.status(500)
    }
})

app.get("/hobby-community/:hobbyId", async (req, res) => {
    const { hobbyId } = req.params
    try {
        const hobby = await prisma.hobby.findUnique({
            where: { id: parseInt(hobbyId) },
        })
        if (!hobby) {
            return res.status(404)
        }
        res.json(hobby)
    } catch (error) {
        console.erro(error)
        res.status(500)
    }
})

app.post("/:hobbyId/:username/new-post", async (req, res) => {
    const { hobbyId, username } = req.params
    try {
        const hobby = await prisma.hobby.findUnique({
            where: { id: parseInt(hobbyId) },
        })
        if (!hobby) {
            return res.status(404)
        }
        const user = await prisma.user.findUnique({
            where: { username: username },
        })
        if (!user) {
            return res.status(404)
        }
        const { imgUrl, caption} = req.body
        const Post = await prisma.post.create({
            data: {
                imgUrl,
                caption,
                hobbyId: parseInt(hobbyId),
                username
            }
        })
        res.json(Post)
        
    } catch (error) {
        console.error(error)
        res.status(500)
    }
    
    });

app.put("/:postId/edit-post", async (req, res) => {
    const { postId } = req.params
    const { imgUrl, caption } = req.body
    try {
        const currentPost = await prisma.post.findUnique({
            where: { id: parseInt(postId) },
        })
        if (!currentPost) {
            return res.status(404)
        }
        const updatedPost = await prisma.post.update({
            where: { id: parseInt(postId) },
            data: {
                caption: caption !== undefined && caption !== '' ? caption : currentPost.caption,
                imgUrl: imgUrl !== undefined && imgUrl !== '' ? imgUrl : currentPost.imgUrl,
            }
        })
        res.json(updatedPost)
        
    } catch (error) {
        console.error(error)
        res.status(500)
    }
    
    });

app.put("/:username/edit-profile", async (req, res) => {
    const { username } = req.params
    const { firstname, lastname, pronouns, bio, pfp } = req.body
    try {
        const currentUser = await prisma.user.findUnique({
            where: { username: username },
        })
        if (!currentUser) {
            return res.status(404)
        }
        const updatedUser = await prisma.user.update({
            where: { username: username },
            data: {
                firstname: firstname !== undefined && firstname !== '' ? firstname : currentUser.firstname,
                lastname: lastname !== undefined && lastname !== '' ? lastname : currentUser.lastname,
                pronouns: pronouns !== undefined && pronouns !== '' ? pronouns : currentUser.pronouns,
                bio: bio !== undefined && bio !== '' ? bio : currentUser.bio,
                pfp: pfp !== undefined && pfp !== '' ? pfp : currentUser.pfp,
            }
        })
        res.json(updatedUser)
    } catch (error) {
        console.error(error)
        res.status(500)
    }
    
    });

app.put("/:currentUser/edit-user", async (req, res) => {
    const { currentUser } = req.params
    const { newUser } = req.body
    try {
        const thisUser = await prisma.user.findUnique({
            where: { username: currentUser },
        })
        if (!thisUser) {
            return res.status(404)
        }
        const changeUser = await prisma.user.findUnique({
            where: { username: newUser },
        })
        if (!changeUser) {
            const updatedUser = await prisma.user.update({
                where: { username: currentUser },
                data: {
                    username: newUser,
                }
            })
            return res.json(updatedUser)
        }
        
    } catch (error) {
        console.error(error)
        res.status(500)
    }
    
    });

app.put("/:username/change-password", async (req, res) => {
    const { username } = req.params
    const { currentPassword, newPassword } = req.body
    const userRecord = await prisma.user.findUnique({
        where : { username: username }
    });
    if (!userRecord) {
        return res.status(404)
    }
    bcrypt.compare(currentPassword, userRecord.hashedPassword, function(err, result) {
        if (result) {
            bcrypt.hash(newPassword, saltRounds, async function(err, hashed) {
                if (err) {
                    console.error("error hashing")
                    return res.status(500)
                }
                try {
                    const updatedUser = await prisma.user.update({
                        where : { username: username },
                        data : { 
                            hashedPassword: hashed,
                        }
                    });
                    res.status(200).json(updatedUser);
                } catch (e) {
                    res.status(500).json({"error": e.message});
                }
            });
        } else {
            res.status(500).json({"error": err});
        }
    });
    
    });

app.put("/:username/change-bg", async (req, res) => {
    const { username } = req.params
    const { color } = req.body
    const thisUser = await prisma.user.findUnique({
        where: { username: username },
    })
    if (!thisUser) {
        return res.status(404)
    }
    const updatedUser = await prisma.user.update({
        where: { username: username },
        data: {
            backgroundColor: color,
        }
    })
    return res.json(updatedUser)
    
    });

app.put("/:username/change-hobby", async (req, res) => {
    const { username } = req.params
    const { hobbyId } = req.body
    const thisUser = await prisma.user.findUnique({
        where: { username: username },
    })
    if (!thisUser) {
        return res.status(404)
    }
    const updatedUser = await prisma.user.update({
        where: { username: username },
        data: {
            hobbyId: parseInt(hobbyId),
        }
    })

    const currentHobby = await prisma.hobby.findUnique({
        where: { id: parseInt(hobbyId) },
    })
    const output = {hobbyName: currentHobby.name, ...updatedUser}
    return res.json(output)
    
    });

app.delete('/:username/delete/:postid', async (req, res) => {
    const { username, postid } = req.params
    let posts = await prisma.post.findMany()
    const initialLength = posts.length
    const postToDelete = posts.find((post) => post.id === postid)
    posts = posts.filter(post => post.id !== postid)

    try {
        await prisma.post.delete({
            where : { id: parseInt(postid) }
        })
        res.json(postToDelete)
    } catch (error) {
        res.status(404)
        console.error(error)
    }
})

app.delete('/clear-notifications/:userId', async (req, res) => {
    const { userId } = req.params
    let notifications = await prisma.notification.deleteMany({
        where: { userId: parseInt(userId) }
    })
    res.json(notifications)
})

app.delete('/delete/:notifid', async (req, res) => {
    const { notifid } = req.params
    let notifs = await prisma.notification.findMany()
    const initialLength = notifs.length
    const notifToDelete = notifs.find((notif) => notif.id === notifid)
    notifs = notifs.filter(notif => notif.id !== notifid)
    await prisma.notification.delete({
        where : { id: parseInt(notifid) }
    })
    res.json(notifToDelete)
})

app.post('/posts/:username/:id/like', async (req, res) => {
    const { username, id } = req.params
    try {
        const updatedPost = await prisma.post.update({
            where: { id: parseInt(id) },
            data: {
                likes: {
                    increment: 1,
                },
            },
        })
        const user = await prisma.user.findUnique({
            where: { username: username },
        })
        if (!user) {
            res.status(404)
        }
        const likedPosts = [parseInt(id), ...user.likedPosts]
        const updatedUser = await prisma.user.update({
            where: { username: username },
            data: {
                likedPosts: likedPosts
            },
        })
        res.json({likedPosts: updatedUser.likedPosts, ...updatedPost})
    } catch (error) {
        console.error(error)
    }
})

app.post('/posts/:username/:id/dislike', async (req, res) => {
    const { username, id } = req.params
    try {
        const updatedPost = await prisma.post.update({
            where: { id: parseInt(id) },
            data: {
                likes: {
                    decrement: 1,
                },
            },
        })
        const user = await prisma.user.findUnique({
            where: { username: username },
        })
        if (!user) {
            res.status(404)
        }
        const currentLikedPosts = user.likedPosts
        newLikedPosts = currentLikedPosts.filter((postid) => postid !== parseInt(id))
        const updatedUser = await prisma.user.update({
            where: { username: username },
            data: {
                likedPosts: newLikedPosts
            },
        })
        res.json({likedPosts: updatedUser.likedPosts, ...updatedPost})
    } catch (error) {
        console.error(error)
    }
})

app.get("/posts/:id/comments", async (req, res) => {
    const { id } = req.params
    const post = await prisma.post.findUnique({
        where: { id: parseInt(id) },
        select: {
            comments: true
        }
    })
    if (post) {
        res.json(post.comments)
    } else {
        res.json({error: "card not found"})
    }
})

app.post('/:postid/:username/comments', async (req, res) => {
    const { postid, username } = req.params
    const { comment } = req.body
    try {
        const newComment = await prisma.comments.create({
            data: {
                postId: parseInt(postid),
                text: comment,
                username: username
            },
        })
        const updatedPost = await prisma.post.findUnique({
            where: { id: parseInt(postid)}
        })
        res.json(updatedPost)
    } catch (error) {
        console.error(error)
    }
})

app.get("/:hobbyId/posts/search", async (req, res) => {
    const { hobbyId } = req.params
    const { caption } = req.query
    let whereClause = {
        hobbyId: parseInt(hobbyId),
    }
    if (caption) whereClause.caption = { contains: caption }
    try {
        const posts = await prisma.post.findMany({
            where: whereClause,
        })
        res.json(posts)
    } catch (error) {
        console.error(error)
        res.status(500).send('server error')
    }
})

app.put('/notifications/:userid/read', async (req, res) => {
    const { userid } = req.params
    const { timestamp } = req.body
    try {
        const updatedNotification = await prisma.notification.updateMany({
            where: { userId: parseInt(userid),
                    createdAt: { lt: new Date(timestamp) },
                    read: false,
             },
            data: { read: true },
        })
        res.json(updatedNotification)
    } catch (error) {
        console.error(error)
    }
})

app.get('/questionnaire', async (req, res) => {
    try {
        let questionsAndOptions = {}
        const allQuestions = await prisma.questions.findMany()
        for (const question of allQuestions) {
            const options = await prisma.questionOptions.findMany({
                where: { questionId: question.id }
            })
            const questionAndOptions = {
                question,
                options
            }
            questionsAndOptions[parseInt(question.id)] = questionAndOptions

        }
        res.json(questionsAndOptions)

    } catch (error) {
        console.error(error)
    }

})

app.post('/user-answers', async (req, res) => {
    try{
        const { userId, questionOptionIds } = req.body
        const dataCreate = []
        for (qId in questionOptionIds) {
            try {
                await prisma.questionUserAnswers.deleteMany({
                    where: { questionId: parseInt(qId), userId: parseInt(userId) }
                })
            } catch (error) {
                console.error(error)
                continue
            }
            dataCreate.push({questionOptionId: parseInt(questionOptionIds[qId]), userId: parseInt(userId), questionId: parseInt(qId)})
        }
        
        const userAnswers = await prisma.questionUserAnswers.createMany({
            data: dataCreate,
            skipDuplicates: true
        })
        res.json(userAnswers)
    } catch (error) {
        console.error(error)
    }
    
})

app.get('/recommendations/:userId', async (req, res) => {
    try {
        const userAnswers = {}
        const userOptions = {}
        const recommendations = {}
        const hobbyToId = {}
        const { userId } = req.params
        const answers = await prisma.questionUserAnswers.findMany({
            where: { userId: parseInt(userId) }
        })
        const hobbies = await prisma.hobby.findMany()
        for (const hobby of hobbies) {
            recommendations[hobby.name] = 0
        }

        for (const answer of answers) {
            userAnswers[parseInt(answer.id)] = answer
            userOptions[parseInt(answer.questionOptionId)] = answer.questionOption
            const interestWeight = await prisma.optionInterestWeights.findUnique({
                where: { qoId: parseInt(answer.questionOptionId) }
            })
            const interest = await prisma.interests.findUnique({
                where: { id: interestWeight.interestId }
            })

            const hobbiesToAdd = await prisma.hobby.findMany({
                where: { interestId: interest.id }
            })
            for (const hobby of hobbiesToAdd) {
                const hobbyWeight = await prisma.optionHobbyWeights.findFirst({
                    where: { hobbyId: hobby.id,
                        qoId: parseInt(answer.questionOptionId)
                    }
                })
                recommendations[hobby.name] += interestWeight.weight
                hobbyToId[hobby.name] = hobby.id
                if (hobbyWeight != null) {
                    recommendations[hobby.name] += hobbyWeight.weight
                }

            }
        }
        const recArray = Object.entries(recommendations)
        recArray.sort((a,b) => b[1] - a[1])
        const topHobbies = {}
        for (let i = 0; i < 5; i++) {
            topHobbies[recArray[i][0]] = hobbyToId[recArray[i][0]]
        }
        res.json(topHobbies)

    } catch (error) {
        console.error(error)
    }
})

app.get('/:hobbyId/get-tools', async (req, res) => {
    const { hobbyId } = req.params
    const hobby = await prisma.hobby.findUnique({
        where: { id: parseInt(hobbyId) },
        select: { tools: true },
    })
    if (!hobby) {
        return res.status(404)
    }
    res.json(hobby.tools)
})

    

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })