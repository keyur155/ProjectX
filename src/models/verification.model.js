import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const VerificationSchema = new mongoose.Schema(
    {
        email :{
        type : String,
        required : true,
        verified : false,
        unique : true,  
        trim: true, 
        index: true, // Add index for faster search
        },
        phone :{
        type : String,
        verified : false, 
        unique : true,
        trim: true,         
      
        },
    otp:{
        type:String,
        required:true,
    },
    expiresAt: { type: Date, required: true },

},
 { timestamps: true });


VerificationSchema.pre('save',async function(){
      this.otp = await  bcrypt.hash(this.otp,12);
});

VerificationSchema.methods.CompareOTP = async function (otp){
      console.log("otp in compare",otp);
      return await bcrypt.compare(otp,this.otp);
}

 // TTL index for auto-cleanup
VerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
VerificationSchema.index({ user: 1, type: 1 });

export const Verification = mongoose.model("Verification",VerificationSchema)