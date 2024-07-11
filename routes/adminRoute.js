
const express = require('express')
const admin_route =express()

const session = require('express-session')


const auth = require('../middleware/adminAuth')

// parsing made possible through the default parser
admin_route.use(express.urlencoded({extended:true}))
admin_route.set('view engine', 'ejs')
admin_route.set('views' , './views/admin')

const multer =require('multer')
const path = require('path')

admin_route.use(express.static('public'))
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

const adminController = require('../controllers/adminController')





admin_route.get('/', auth.isLogout ,adminController.loadAdmin )


admin_route.post('/' ,adminController.adminVerify)
  
admin_route.get('/home', auth.isLogin , auth.noBack ,adminController.loadDashboard)

admin_route.get('/logout',auth.isLogin  ,adminController.logoutAdmin)

admin_route.get('/dashboard' , adminController.adminDash)

admin_route.get('/newUser' ,auth.isLogin,  adminController.newUserLoad)
admin_route.post('/newUser' , upload.single('image') ,adminController.insertNewUser)


admin_route.get('/editUser' ,auth.isLogin,  adminController.editorLoad)
admin_route.post('/editUser' ,  adminController.updateUser)

admin_route.get('/deleteUser' ,adminController.deleteUser )

// admin_route.get('/searchUser', adminController.searchUser)


admin_route.get('*', (req,res)=>{
   return res.redirect('/admin')
    

})


module.exports =admin_route