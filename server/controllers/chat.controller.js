const chatSchema = require('../models/chat.model')

const createChat = async (req, res) => {
    const { firstId, secondId } = req.body
    try {
        let chat = await chatSchema.findOne({
            members: { $all: [firstId, secondId] }
        })
        if (chat) return res.status(200).json(chat)
        const newChat = new chatSchema({
            members: [firstId, secondId]
        })
        chat = await newChat.save()
        res.status(200).json(chat)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}
const findUserChats = async (req, res) => {
    const userId = req.params.userId
    try {
        const chats = await chatSchema.find({
            members: { $in: [userId] }
        })
        res.status(200).json(await chats)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}
const findUserChat = async (req, res) => {
    const { firstId, secondId } = req.params
    try {
        const chat = await chatSchema.findOne({
            members: { $all: [firstId, secondId] }
        })
        res.status(200).json(chat)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

module.exports = {
    findUserChat, findUserChats, createChat
}