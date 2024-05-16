const { register, login, findUser, findAllUser } = require('../controllers/user.controller')
const router=require('express').Router()


router.post('/reg',register)
router.post('/login',login)
router.get('/find/:userId',findUser)
router.get('/',findAllUser)

module.exports=router