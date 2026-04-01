import mongoose from "mongoose";

const priceConfiugrationSchema = new mongoose.Schema(
    {
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true,
        },
        categoryId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Category",
        },
        platformFees :{
            type : Number,
            required : true,
            min : 0,
            default : 0.15,
        },

        effectiveFrom: {
            type: Date,
            default: Date.now
        },
        
        effectiveTo: {
            type: Date,
            default: null // null means no end date
        },
  
        isActive :{
            type : Boolean,
            default : true,
        },
        changeReason :{
            type : String,
            trim: true,
            maxlength : 200,
            minlength : 10,
        },
        // percentage
         hike :{
                type : Number,
                required : true,
                min : 0,
                max:100
            },
        priceHistory :[
        {
            oldPrice :{
                type : Number,
                required : true,
                min : 0,    
            },
            newPrice :{
                type : Number,
                required : true,
                min : 0,
            },
            hike :{
                type : Number,
                required : true,
                min : 0,
                max:100
            },
            createdAt :{
                type : Date,
                default : Date.now, 
            }
        }]  ,
        updatedAt :{
            type : Date,
            default : Date.now, 
        }



    },{
        timestamps:true
     }
);
    

const PricingConfiguration = mongoose.model("PricingConfiguration", priceConfiugrationSchema);
export default PricingConfiguration;