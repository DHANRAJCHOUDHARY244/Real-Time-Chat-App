const router=require('express').Router()

const userRoutes=require('./user.routes')


router.use('/auth',userRoutes)

module.exports=router