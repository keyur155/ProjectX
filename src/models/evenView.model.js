import mongoose from "mongoose";

const EventViewSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    event:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required : true,
        index:true
    },
    ip:{
        type:String
    },
    viewedAt:{
        type: Date,
        default: Date.now(),
        expires: 600
    }
})

const EventView = mongoose.model('EventView',EventViewSchema);
export default EventView;