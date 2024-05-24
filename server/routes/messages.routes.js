const { createMessage, getMessages } = require('../controllers/messages.controller')

const router = require('express').Router()

router.post('/', createMessage)
router.get('/:chatId', getMessages)

module.exports = router