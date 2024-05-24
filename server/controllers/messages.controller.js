const messageSchema = require('../models/message.model')

const createMessage = async (req, res) => {
    const { chatId, senderId, text } = req.body
    try {
        let message = new messageSchema({
            chatId, senderId, text
        })
        message = await message.save()
        res.status(200).json(message)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

const getMessages = async (req, res) => {
    const { chatId } = req.params
    try {
        const messages = await messageSchema.find({
            chatId
        })
        res.status(200).json(messages)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { createMessage, getMessages }