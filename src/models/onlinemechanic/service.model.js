import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema ({
       user :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
       },
        title :{  
            type : String,
            required : true,    
       },
        description :{ 
            type : String,
            required : true,    
       },
       applicabeleFor :{
            type : String,
            required : true,
            enum : ["twoWheeler", "fourWheeler","threeWheeler", "heavyVehicle", "all"],    
       },
       serviceType:{
        type : String,
        required : true,
        enum : ["repair", "maintenance","service", "tow"],
       },
       active :{
        type : Boolean,
        default : false,
       },
       

        });

export const Service = mongoose.model("Service", serviceSchema);