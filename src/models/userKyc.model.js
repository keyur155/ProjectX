import mongoose from "mongoose";

const userKycSchema = new mongoose.Schema(
    {
        userId:{
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true,    
        },
        aadharCard :{
                        FrontPagedocumentUrl :{
                            type : String,
                            required : true,
                            default : "",
                        },
                        backPagedocumentUrl :{
                            type : String,
                            required : true,
                            default : "",
                        },
                       
                        isValid:{
                            type : Boolean,
                            default : false,
                        } 
                    },
        panCard :{
        documentUrl :{
                            type : String,
                            default : "", 
                        },
        isValid:{
                            type : Boolean,
                            default : false,
                        }
        
                    },
    passport :{
                      FrontPagedocumentUrl :{
                            type : String,
                            required : true,
                            default : "",
                        },
                        backPagedocumentUrl :{
                            type : String,
                            required : true,
                            default : "",
                        },
                    },
        
                    address:{
                         documentUrl :{
                            type : String,
                            required : true,    
                    },
                    isValid:{
                        type : Boolean,
                        default : false,
                    }
                    },  
        
                    selfieUrl :{
                            type : String,
                            required : true,
                            default : "", 
        
                        },
      kycVerified :{
        type:Boolean,
        default: false
      }

    }
);

export const UserKyc = mongoose.model("UserKyc", userKycSchema);    