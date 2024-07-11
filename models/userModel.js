
const mongoose =require('mongoose')

const userSchema = new mongoose.Schema({

   name:{

        type:String,
        required:true
   },

   email:{
        type:String,
        required:true,
        unique:true

   },

   mobile:{
    type:Number,
    required:true
    },

    password:{
        type:String,
        require:true
    },
    image:{
        type:String,
        required:true
   },

   is_admin:{

        type:Number,
        default:0

   },

   is_verified:{

     
        type:Number,
        default:0 
   }

});

module.exports = mongoose.model('User' , userSchema)

