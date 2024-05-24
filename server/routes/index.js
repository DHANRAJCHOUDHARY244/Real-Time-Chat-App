const router = require('express').Router()

const userRoutes = require('./user.routes')
const chatRoutes = require('./chat.routes')
const messageRoutes = require('./messages.routes')


router.use('/auth', userRoutes)
router.use('/chat', chatRoutes)
router.use('/message', messageRoutes)

module.exports = router