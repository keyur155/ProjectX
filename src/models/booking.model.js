import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    categoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category'
    },
    eventId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Event'
    },
    status:{
        type:String,
        enum:['pending','confirmed','cancelled'],
        default:'pending'
    },
    booked_amount:{
        type:Number,
        required:true
    },
    payment:{
        transcationId:{
             type:String,
             required:true    
        },
        paymentMethod:{ 
                type:String,
                enum:['credit_card','paypal','UPI','debit_card','net_banking'],
                required:true
        },
        payment_status:{
                type:String,
                enum:['pending','paid','failed'],
                default:'pending'
            },
        original_amount:{
                type:Number,
                required:true
        },
        amount_paid:{
                type:Number,    
                required:true
        },
        discount:{
            type:Number,
            default:0
        },
        platform_fees:{
            type:Number,
            default:0
        },

    
    },
    
    cancelled:{
        isCancellable :{
            type : Boolean,
            default : true,
        },
        cancellationReason :{
            type : String,
            maxlength : 200,    
        },
        cancellationDate :{
            type : Date,
        },
        refundAmount :{ 
            type : Number,
            default : 0,
        },
        redundStatus :{ 
            type : String,
            enum : ['pending','processed','failed'],
            default : 'pending',    
        },
            
    },
    isActive:{
        type:Boolean,
        default:false
    },
  

    },{
    timestamps:true

    }
);

export const Booking = mongoose.model('Booking', bookingSchema);

