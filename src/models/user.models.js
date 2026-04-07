import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const userSchema = new mongoose.Schema(
    {
    //    username :{
    //     type : String,
    //     required : true,
    //     trim: true,  
    //     index: true, // Add index for faster search  
    //    },
      firstName :{
        type : String,
        required : true,
        trim: true,
        lowercase: true,
        minlength: 3,
        maxlength: 20,
        index: true, // Add index for faster search
     },
     lastName :{
        type : String,
        required : true,
        trim: true,
        lowercase: true,
        minlength: 3,
        maxlength: 20,
    },
       email :{
        type : String,
        required : true,
        verified : false,    
        unique : true,
        trim: true,   
       },
       phone :{
        type : String,
        required : true,
        verified : false,    
        unique : true, 
        trim: true,         
       },
       password :{
        type : String,  
        required : true, 
        minlength : 8,
        trim: true,    
       } ,
       profilePicture :{
        type : String,
        default : "",
           
       }, 
       kycStatus :{
        type : String,
        enum : ["pending", "verified", "rejected"], 
       },
       isSubscribed:{
        type : Boolean,
        default : false,
       },
       isLoggedIn :{
        type : Boolean,
        default : false,
       },
       role :{
          type :String,
          default :"user"
       },
       
       isActive :{
        type : Boolean,
        default : true,
       },

       isGuest :{
        type : Boolean,
        default : true,
       },  
       isSuperAdmin :{
        type : Boolean,
        default : false,
       },
       isSuspended :{
        type : Boolean,
        default : false,
       },
        refreshToken :{
        type : String,
        default : "",
       },
       
            
       
}
,{
    timestamps:true
}
);


userSchema.pre('save', async function () {
  // In async middleware Mongoose doesn't supply `next`; just return/await.
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.isCorrectPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      phone: this.phone,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET || "dev-access-secret",
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m",
    }
  );
};


userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET || "dev-refresh-secret",
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
    }
  );
};


    

const User  = mongoose.model("User" ,userSchema);
export default User;

