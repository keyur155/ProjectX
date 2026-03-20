import mongoose from 'mongoose';

const userShema = new mongoose.Schema(
    {
       username :{
        type : String,
        required : true,    
       },
       email :{
        type : String,
        required : true,
        verified : false,    
        unique : true,
       },
       phone :{
        type : String,
        required : true,
        verified : false,    
        unique : true,      
       },
       password :{
        type : String,  
        required : true, 
        minlength : 8,
       } ,

       profilePicture :{
        type : String,
        default : "",
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
}
,{
    timestamps:true
}
);

const User  = mongoose.mmodel("User" ,userShema);
export default User;