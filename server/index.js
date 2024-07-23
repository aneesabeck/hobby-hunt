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

// NOTIFICATONS


pgClient.connect()

pgClient.query('LISTEN new_user')
pgClient.query('LISTEN new_post')

pgClient.on('notification', async (msg) => {
    console.log('received notifictiion:')
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
            // await prisma.notification.findMany
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
    console.log('Client connected')
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
    // console.log(notifications)
    // const readNotifs = await prisma.notification.findMany({
    //     where: { userId: parseInt(userId),
    //             createdAt: { gt: new Date(timestamp) },
    //             read: true,
    //      },
    //     orderBy: { createdAt: 'desc'}
    // })
    // const unreadNotifs = await prisma.notification.findMany({
    //     where: { userId: parseInt(userId),
    //             createdAt: { lt: new Date(timestamp) },
    //             read: false,
    //      },
    //     orderBy: { createdAt: 'desc'}
    // })
    // const allNotifs = {"read": [], "unread": []}
    // for (let notif of notifications) {
    //     if (notif.read) {
    //         allNotifs.read.push(notif)
    //     } else {
    //         allNotifs.unread.push(notif)
    //     }
       
    // }
    // console.log("notifications")
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
            // Store hash in your password DB.
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
            res.status(500).json({"error": e.message});
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
        console.log(error)
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
        console.error('Error fetching hobbyId')
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
        console.error('Error fetching posts')
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
        console.error('Error fetching hobby')
        console.log(error)
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
        console.error('Error fetching hobby')
        console.log(error)
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
        console.error('Error creating post')
        console.log(error)
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
        console.error('Error editing post')
        console.log(error)
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
        console.error('Error editing profile')
        console.log(error)
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
        console.error('Error editing username')
        console.log(error)
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
        console.log(error)
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
        console.log(error)
    }
})

app.post('/posts/:username/:id/dislike', async (req, res) => {
    console.log("dislike")
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
        console.log(error)
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
        console.log(error)
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
        console.log(error)
        res.status(500).send('server error')
    }
})

app.put('/notifications/:userid/read', async (req, res) => {
    const { userid } = req.params
    console.log(userid)
    const { timestamp } = req.body
    console.log(timestamp)
    console.log(new Date(timestamp))
    try {
        const updatedNotification = await prisma.notification.updateMany({
            where: { userId: parseInt(userid),
                    createdAt: { lt: new Date(timestamp) },
                    read: false,
             },
            data: { read: true },
        })
        console.log("up", updatedNotification)
        res.json(updatedNotification)
    } catch (error) {
        console.log(error)
    }
})

app.get('/questionnaire', async (req, res) => {
    try {
        const questionsAndOptions = {}
        const questions = prisma.questions.findMany()
        questions.forEach(question => {
            const options = prisma.questionoptions.findMany({
                where: { questionId: question.id }
            })
            const questionAndOptions = {
                question,
                options
            }
            questionsAndOptions[question.id] = questionAndOptions
        })
        return res.json(questionsAndOptions)

    } catch (error) {
        console.error("fetch questionnaire", error)
    }

})

app.post('/user-answers', async (req, res) => {
    const { userId, questionOptionId } = req.body()
    const userAnswers = prisma.questionuseranswers.create({
        data: {
            questionOptionId: parseInt(questionOptionId),
            userId: parseInt(userId)
        }
    })
    res.json(userAnswers)
})

app.get('/recommendations', async (req, res) => {
    const userAnswers = {}
    const { userId } = req.body()
    const answers = prisma.questionuseranswers.findMany({
        where: { userId: parseInt(userId) }
    })
    answers.forEach(answer => {
        console.log("answer", answer.createdAt)
        userAnswers[answer.id] = answer
        // add if check for date
    })
    const hobbyWeights = {}
    userAnswers.forEach(userAnswer => {
        const optionWeights = prisma.optionweights.findMany({
            where: {
                qoId: userAnswer.questionOptionId
            }
        })
        optionWeights.forEach(weight => {
            const hobbyWeight = hobbyWeights[weight.hobbyId] ?? 0
            hobbyWeights[weight.hobbyId] = hobbyWeight + weight.weight
        })
    })
})

    

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })