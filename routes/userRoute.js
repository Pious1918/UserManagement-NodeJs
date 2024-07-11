const express = require('express')

const user_route = express()

const session = require('express-session')
const config = require('../config/config')

const auth =require('../middleware/auth')


user_route.set('view engine', 'ejs')
user_route.set('views' , './views/users')

user_route.use(express.urlencoded({extended:true}))

const multer =require('multer')
const path = require('path')

user_route.use(express.static('public'))
// user_route.use('/css',express.static(path.join(rootDir , 'node_modules' ,'bootstrap','dist','css')))

const storage =multer.diskStorage({
    destination:(req,file, cb)=>{
        cb(null , path.join(__dirname, '../public/userImages'))
    },
    filename:(req, file,cb)=>{
        const name = Date.now()+'-'+file.originalname;
        cb(null, name);
    }
})

const upload = multer({storage:storage})

 
const userController = require('../controllers/userController');


user_route.get('/register',auth.isLogout, userController.loadRegister)

user_route.post('/register' ,upload.single('image') ,userController.insertUser)

user_route.get('/verify' , userController.verifyMail)

user_route.get('/', userController.mainStart)

user_route.get('/login',auth.isLogout,userController.loginLoad)
user_route.post('/login',userController.verifyLogin)

user_route.get('/home', auth.isLogin  ,userController.loadHome)

user_route.get('/logout' , auth.isLogin, userController.userlogout )
 
user_route.get('/edit', auth.isLogin, userController.editProfile )
user_route.post('/edit', upload.single('image') ,userController.updateProfile )




module.exports = user_route ;

 
