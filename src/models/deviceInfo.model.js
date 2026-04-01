import mongoose from "mongoose";

const DeviceSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : User
    },
    deviceInfo :{
        deviceType:{
            type: String,
            enum: ['mobile', 'tablet', 'desktop', 'other'] ,
            name:String,   
        },
        browser:{
            type:String
        },
        os:{
            type:String
        },
        ipAddress:{
            type:String
        }
    },
    lastActivity: { type: Date, default: Date.now },

},
{ timestamps: true }
)

export  const DeviceInfo = mongoose.model('DeviceInfo',DeviceSchema);