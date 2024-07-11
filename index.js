const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost:27017/user_management_system")
const config = require('./config/config')
const session = require('express-session')
const express = require('express')
const app =express()


app.use(session({
    secret:config.sessionSecret,
    resave:false,
    saveUninitialized:false,
}))

app.use((req,res,next)=>{
    res.set('Cache-control','no-store,no-cache');
    next();
});

// for user route
const userRoute = require('./routes/userRoute')
const adminRoute = require('./routes/adminRoute')


app.use('/' , userRoute);
app.use('/admin' , adminRoute)



// ------------------------------------------
app.listen(3000,()=>{
    console.log("server on 3000")
})