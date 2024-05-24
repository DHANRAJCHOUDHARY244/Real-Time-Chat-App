const { createChat, findUserChats, findUserChat } = require('../controllers/chat.controller')

const router = require('express').Router()

router.post("/", createChat)
router.get("/:userId", findUserChats)
router.get("/find/:firstId/:secondId", findUserChat)

module.exports = router
