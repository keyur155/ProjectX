import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({

    eventhostId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    eventTitle :{
        type : String,
        required : true,
        trim: true,
        unique : true,
        index : true,  
    },
    category :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Category",
        required : true,
        index : true,
    },
    description :{
        type : String,  
        required : true,
        maxlength : 500,
        minlength : 20,
    },
    eventDate :{
        type : Date,
        required : true,
        index : true,
    },
    location :[
        {
        type: {
                type: String,
                enum: ["Point"],
                default: "Point"
            },
        coordinates :{
            type:[Number],
            required : true,
            validate : {
                validator : function(coords){
                    return coords.length === 2 && coords[0] >= -90 && coords[0]
                    <= 90 && coords[1] >= -180 && coords[1] <= 180;
                },
            message : "Coordinates must be an array of [latitude, longitude] with valid values.",
            },

        },
         address: String,
        city: String,
        state: String,
        postalCode: String
                
        }
        
    ],
    
    enableOfflineTickets :{
        type : Boolean,
        default : false,
    },

    tickets: [
  {
    name: { type: String, required: true }, 
    total: { type: Number, required: true },
    sold: { type: Number, default: 0 },
    price: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    maxPerUser: { type: Number, default: 5 }
  }
],
    
   
    isSoldOut :{
        type : Boolean,
        default : false,
    },
    isVirtual :{
        type : Boolean,
        required : true,
        default : false,
    },  

    eventImage :[{
        url: {
            type : String,
            required : true,
            validate: {
                validator: function(v) {
                     return !v || /^https?:\/\/.+/.test(v);
                }
            }
        },

        format:{
            type : String,
            enum : ["jpg", "jpeg", "png" ,"webp","mp4","avi","mov"],
            required : true,
        },

        caption :{
            type : String,
            trim: true,
            maxlength : 100,
        },

        isPrimary :{
            type : Boolean,
            default : false,
        },

        publicId :{
            type : String,
            required : true,
            
       }
    }],
    
    rating :{
        type : Number,
        default : 0,
        index : true,
    },
    reviews :[{
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
        },
        comment : {
            type : String,
            required : true,
            maxlength : 200,
        },
        rating : {
            type : Number,
            required : true,
            min : 1,
            max : 5,
        },
        createdAt : {
            type : Date,
            default : Date.now,
        }
    }],
    rulesandGuidelines :[{
        commonRules :{
            type : [String],
            required : true,
        },
        additionalRules :{
            type : Object,
            default : {},
        },
        default: { commonRules: [], additional: {} }
        
    }],

    maxCapacity: Number,
    totalSold: { type: Number, default: 0 },
    bookingDeadline: Date,
    status: {
        type: String,
        enum: ["draft", "published", "cancelled", "completed"],
        default: "draft"
    },

    isPublished :{
        type : Boolean,
        default : false,    
    },
    createdAt :{
        type : Date,
        default : Date.now, 
    },
    updatedAt :{
        type : Date,
        default : Date.now, 
    }
    },
    {
        timestamps:true
    }
        
);   
const Event = mongoose.model("Event", eventSchema);
export default Event;


//  ticketsAvailable :[
//         { 
//             stock_ticket :{
//                 type : Number,
//                 required : true,
//                 min : 0,
//             },
//             sponsored_ticket :{
//                 type : Number,
//                 required : true,
//                 min : 0,
//             },
//            vip_ticket :{
//                 type : Number,
//                 required : true,
//                 min : 0,
//             },
//             tier1_ticket :{
//                 type : Number,
                
//                 min : 0,
//             },
//             tier2_ticket :{
//                 type : Number,
                
//                 min : 0,
//                 },
//             tier3_ticket :{
//                 type : Number,
               
//                 min : 0,
//                 },
//             tier4_ticket :{
//                 type : Number,
//                 min : 0,
                
//                 }


//         }
//     ],