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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })