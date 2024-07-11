const User = require('../models/userModel')
const bcrypt = require('bcrypt')


const loadAdmin = async(req,res)=>{

    try {

        res.render('login')

    } catch (error) {
        console.log(error.message)
    }
}


// verify admin

const adminVerify = async(req,res)=>{

    try {
        const email =req.body.email
        const password = req.body.password

        const adminData  = await User.findOne({email:email })

        if(adminData){

            const passwordMatch = await bcrypt.compare(password,adminData.password)

            if(passwordMatch){ 

                if(adminData.is_admin===0){
                    return res.render('login' , {message:"password is incorrect"})
                }else{
                    req.session.user_id=adminData._id
                    return res.redirect("/admin/home")
                    console.log(is_admin)
                }

            }else{
                return res.render('login' , {message:"password is incorrect"})
            }
        }
        else{
            return res.render('login' , {message:"email and password are incorrect"})
        }
        
    } catch (error) {
        console.log(error.message)
    }
}

const loadDashboard = async(req,res)=>{

    try {

      const adminData = await User.findById({_id:req.session.user_id})
        res.render('home' , {admin:adminData})
        
    } catch (error) {
        console.log(error.message)
    }
}


const logoutAdmin = async(req,res)=>{

    try {
        
        req.session.destroy()
        res.redirect('/admin')
    } catch (error) {
        
        console.log(error.message)
    }
}

// list of users will be here
const adminDash = async(req,res)=>{

    try {

        var search = ''
        if(req.query.search){
            search = req.query.search
        }

       const usersData = await User.find({
        is_admin:0,
        $or:[
            {name:{$regex:'.*'+search+'.*'}}
        ]
    
        })



        res.render('dashboard',{data:usersData})

    } catch (error) {
        console.log(error.message)
    }
}

// add new user starts here
// 1.Loading the page
const newUserLoad = async(req,res)=>{

    try {

        return res.render('newuser')

        
    } catch (error) {
        console.log(error.message)
    }
}

// 2.new user insert

const insertNewUser = async(req,res)=>{

    try {

        

       

            const name= req.body.name
            const email = req.body.email
            const mobile =req.body.mobile
           const password=req.body.password
           const image = req.file.filename
   
        //    const sepassword = await securePassword(req.body.password)
        const user = new User({
            name:name,
            email:email,
            password:password,
            mobile:mobile,
            image:image
        })

        const userData = await user.save()


        if(userData){

            
            return res.render('newuser', {message:"registration has been successfull"})
        }
        else{
            return res.render('newuser', {message:"registration failed"})
        }

        
    } catch (error) {
        console.log(error.message)
    }
}


// Editing the existing user
// 1. Loading the editing page

const editorLoad = async(req,res)=>{

    try {

        const id = req.query.id
        const userData = await User.findById({_id:id})
        

        if(userData){
            return res.render('edituser', { user:userData })
        }else{
            return res.redirect('/admin/dashboard')
        }


  

        
    } catch (error) {
        console.log(error.message)
    }
}
// 2. updating new values

const updateUser = async(req,res)=>{

    try {

       const userData = await User.findByIdAndUpdate({_id:req.body.id} , {$set:{name:req.body.name ,email:req.body.email ,mobile:req.body.mobile}})
        
       return res.redirect('/admin/dashboard')

      
        

        

    } catch (error) {
        console.log(error.message)
    }
}

// 3.Delete existing user

const deleteUser = async(req,res)=>{

    try {
        
        const id = req.query.id
        const userData = await User.deleteOne({_id:id})
        res.redirect('/admin/dashboard')

    } catch (error) {
        console.log(error.message)
    }
}

// const searchUser = async(req,res)=>{

//     try {

//         const namesearch= req.body.search
//         console.log(namesearch)
//         const adminData  = await User.find({ name: { $regex: new RegExp(namesearch, 'i') } })
//         res.redirect('/admin/dashboard')

        

        
//     } catch (error) {
//         console.log(error.message)
//     }
// }







module.exports = {
    loadAdmin,
    adminVerify,
    loadDashboard,
    logoutAdmin,
    adminDash,
    newUserLoad,
    insertNewUser,
    editorLoad,
    updateUser,
    deleteUser
    
}