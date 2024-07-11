const user = require('../models/userModel')

const bcrypt = require('bcrypt')

const nodeMailer = require('nodemailer')
const Mail = require('nodemailer/lib/mailer')
const SMTPConnection = require('nodemailer/lib/smtp-connection')

const securePassword = async(password)=>{

    try {

      const passwordHash = await bcrypt.hash(password, 10)
      return passwordHash 

    } catch (error) {
        
        console.log(error.message)
    }
}

// for send mail

const sendVerifyMail = async (name , email, home)=>{

    try {
        
      const transporter =   nodeMailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:"nspious1999@gmail.com",
                pass:'ipuy mzct ojnn nbqx'
            }
        })

        const mailOptions = {
            from:"nspious1999@gmail.com",
            to:email,
            subject:"for verification mail",
            html:'<p>Hii '+name+'  ,please click here to <a href="http://localhost:3000/verify?id= '+home+'" >verify </a> your Mail.</p>'
        }

        transporter.sendMail(mailOptions, (error, info)=>{
            if(error){
                console.log(error)
            }
            else{
                console.log("email has been send", info.response)
            }

        })

    } catch (error) {
        console.log(error.message)
        
    }
}



// loading main page

const mainStart = async(req,res)=>{
    try {

        res.render('welcomePage')
        
    } catch (error) {
        
        console.log(error.message)
    }
}

const loadRegister = async(req, res)=>{


    try{

        res.render('registration')



    }catch (error){

        console.log(error.message)
    }
}

const insertUser = async(req, res)=>{

    try {

        const sepassword = await securePassword(req.body.password)
       const User = new user({

            name:req.body.name,
            email:req.body.email,
           
            password:sepassword,
            mobile:req.body.mobile,
            image:req.file.filename,
            is_admin:0
            

        })
        
        const email = req.body.email;
        const existingUser = await user.findOne({ email:email });

        if (existingUser) {
          return res.render('registration', { message: 'Email already exists. Please use a different email.' });
        }  

        const userData = await User.save()

        if(userData){

            sendVerifyMail(req.body.name, req.body.email, userData._id )
            // res.render('registration', {message:"registration has been successfull. Please verify your mail"})
            res.redirect('/login')
        }
        else{
            res.render('registration', {message:"registration failed"})
        }

        
    } catch (error) {
        
        console.log(error.message)
    }
}


const verifyMail = async(req, res)=>{
    
    try {
        
       const updateInfo = await user.updateOne({_id:req.query._id}, {$set: {is_verified:1} }  )
       console.log(updateInfo);
       res.render("emailverified")
    } catch (error) {
        console.log(error.message)

    }
}

// login user methods
const loginLoad = async(req, res)=>{

    try {

    
            res.render('loginPage')
        
       
        
    } catch (error) {

        console.log(error.message)
        
    }
}

const verifyLogin = async(req,res)=>{
    try {

        const email =req.body.email
        const password = req.body.password


       const userData  = await user.findOne({email:email })

       if(userData){

      const passwordMatch = await bcrypt.compare(password, userData.password)
        if(passwordMatch){

            req.session.home=userData._id;
            res.redirect("/home")

        }else{
            res.render("loginPage" , {message:"password is incorrect"})
        }
       }
       else{
        res.render("loginPage" , {message:"User login is incorrect"})
       }
        
    } catch (error) {
        console.log(error.message)
    }
}

const loadHome = async(req,res)=>{

    try {
       const userData = await user.findById({_id:req.session.home})
        res.render('home',{ user:userData})
        
    } catch (error) {
        console.log(error.message)
    }
}

const userlogout = async(req,res)=>{
    try {

        req.session.destroy()
        res.redirect('/login')
        
    } catch (error) {
        console.log(error.message)
    }
}


// edit profile starts

const editProfile = async(req,res)=>{
    try {
        
        const id = req.query.id
        const userData = await user.findById({_id:id })
        console.log(userData)

        if(userData) {
            res.render('edit' , {user:userData})
        }
        else{
            res.redirect('/home')
        }

    } catch (error) {
        console.log(error.message)
    }
}

const updateProfile = async(req,res)=>{


    try {

        if(req.file){
            const userData =  await user.findByIdAndUpdate({_id: req.body.user_id}, {$set:{name:req.body.name ,email:req.body.email , mobile:req.body.mobile ,image:req.file.filename  }})
        }else{
        const userData =  await user.findByIdAndUpdate({_id: req.body.user_id}, {$set:{name:req.body.name ,email:req.body.email , mobile:req.body.mobile  }})
        }

        res.redirect('/home')
        
    } catch (error) {
        
        console.log(error.message)
    }
    
}


module.exports = { 
    mainStart , 
    loadRegister,
    insertUser,
    verifyMail,
    loginLoad,
    verifyLogin,
    loadHome,
    userlogout,
    editProfile,
    updateProfile
    
}