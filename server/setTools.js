const { GoogleGenerativeAI } = require("@google/generative-ai")
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()



const genAI = new GoogleGenerativeAI(process.env.BARD_API_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

const setTools = async () => {
    try{
        const hobbies = await prisma.hobby.findMany()
        for (const hobby of hobbies) {
            const prompt = `List affordable tools and resources for the hobby: ${hobby.name} along with prices and a total`
            const result = await model.generateContent(prompt)
            const response = await result.response
            const text = response.text()
            const tools = text
            await prisma.hobby.update({
                where: { id: hobby.id },
                data: { tools }
            })
        }
    } catch (error) {
        console.error(error)
    }
    
    
}

module.exports = setTools