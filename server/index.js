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
const PORT = 3000
const wss = new WebSocket.Server({ port: 8080 }, () => {
    console.log("Websocket server is running on ws://localhost:8080")
})

app.use(express.json());
app.use(cors());

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

        await prisma.notification.createMany({
            data: notifications,
        })
    
        usersToNotify.forEach(user => {
            const client = clients[user.id]
            if (client && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data))
            }
        })
    } else if (msg.channel === 'new_post'){
        console.log("newpost")
        const { hobbyId, caption, username } = payload;
        console.log("user", username)
        const usersToNotify = await prisma.user.findMany({
            where: { hobbyId, username: {not: username}  },
        })
        console.log(usersToNotify)

        const notifications = usersToNotify.map(user => ({
            type: 'new_post',
            message: `New Post: ${caption}`,
            userId: user.id
        }))
        console.log(notifications)

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
})


wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const { userId } = JSON.parse(message)
        clients[userId] = ws
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
            res.status(200).json({});
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
        res.json(updatedUser)
    } catch (error) {
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
    res.json(updatedUser)        
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

app.get("/:hobbyId", async (req, res) => {
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
        console.error('Error fetching posts')
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
        console.error('Error fetching posts')
        console.log(error)
        res.status(500)
    }
    
    });

app.delete('/:username/delete/:postid', async (req, res) => {
    const { username, postid } = req.params
    let posts = await prisma.post.findMany()
    const initialLength = posts.length
    const postToDelete = posts.find((post) => post.id === postid)
    posts = posts.filter(post => post.id !== postid)

    try {
        res.json(postToDelete)
        await prisma.post.delete({
            where : { id: parseInt(postid) }
        })
    } catch (error) {
        console.log(error)
    }
})

app.post('/posts/:id/like', async (req, res) => {
    const { id } = req.params
    try {
        const updatedPost = await prisma.post.update({
            where: { id: parseInt(id) },
            data: {
                likes: {
                    increment: 1,
                },
            },
        })
        res.json(updatedPost)
    } catch (error) {
        console.log(error)
    }
})

app.post('/posts/:id/dislike', async (req, res) => {
    const { id } = req.params
    try {
        const updatedPost = await prisma.post.update({
            where: { id: parseInt(id) },
            data: {
                likes: {
                    decrement: 1,
                },
            },
        })
        res.json(updatedPost)
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

    

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })