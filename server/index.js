const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
require('dotenv').config();
var cors = require('cors')
const express = require('express')
const bcrypt = require('bcrypt');
const saltRounds = 14;
const app = express()
const PORT = 3000

app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
    const users = await prisma.user.findMany()
    res.json(users)
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
    try {
        const hobbies = await prisma.hobby.findMany()
        res.json(hobbies)
    } catch (error) {
        res.status(500)
    }
})

app.get("/:username/get-interests", async (req, res) => {
    const { username } = req.params
    try {
        const user = await prisma.user.findUnique({
            where: { username: username },
            select: { interests: true },
        })
        if (!user) {
            return res.status(404)
        }
        res.json(user.interests)
    } catch (error) {
        console.error('Error fetching interests')
        res.status(500)
    }
})

app.post("/:username/update-hobby/:hobbyId", async (req, res) => {
    const { username, hobbyId } = req.params
    try {
        const updatedUser = await prisma.user.update({
            where: { username: username },
            data: {
                hobbyId: parseInt(hobbyId)
            },
        })
        res.json(updatedUser)        
    } catch (error) {
        res.status(500)
    }
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
        if (!user) {
            return res.status(404)
        }
        res.json(hobby.posts)
    } catch (error) {
        console.error('Error fetching posts')
        res.status(500)
    }
})
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })