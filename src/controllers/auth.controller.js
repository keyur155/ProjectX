import { asyncHandler } from '../utils/asyncHandler.js';
import ApiError from '../utils/apiError.js';
import User from '../models/user.models.js';
import ApiResponse from  '../utils/apiResponse.js';
import DeviceDetector from 'node-device-detector';
import { verifyEmail } from '../utils/mail.service.js';
import GenerateOtp from '../utils/otp.js';
import { Verification } from '../models/verification.model.js';

export const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email,phone, password } = req.body;
    console.log("body ", req.body);

    // Basic safety: should never hit because Joi runs first, but keep guard
    if ([firstName, lastName, email,phone, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "all fields are required");
    }

    const existUser = await User.findOne({
        $or :[{ email , phone }]
    });
    console.log("exist user",existUser);
    if(existUser){
        throw new ApiError(409,"User Already Exist")
       
    }
    
    
    const otp = GenerateOtp();

    const mail_result = await verifyEmail(email,firstName,otp)

    console.log("mail_result", mail_result);

    if(mail_result.response.includes("250 2.0.0 OK")){
          

          const userVerification = new Verification({
            email:email,
            phone:phone,
            otp:otp.toString(),
            expiresAt: new Date(Date.now() + 10 * 60 * 1000) // Expires in 10 minutes
          });
          
            await userVerification.save();
        }
        else{
            throw new ApiError(400,"Invalid Otp");
            
        }
    
    
   
    res.status(201).json({
        success: true,
        message: 'success',
        // data: {
        //     user: {
        //         id: saveUser._id,
        //         firstName: saveUser.firstName,
        //         lastName: saveUser.lastName,
        //         email: saveUser.email,
        //         phone: saveUser.phone
        //     },
        //     accessToken,
        //     refreshToken
        // }
    });
});

export const verifyOtp = asyncHandler( async (req, res)=>{
      const { firstName, lastName, email,phone, password,otp } = req.body;
      
      const verificationRecord = await Verification.findOne({ email, phone });
        if(!verificationRecord){
          throw new ApiError(400," OTP Expired");
        }
      console.log("otp",otp);
    if(verificationRecord.CompareOTP(otp)){

        const saveUser =  new User({
            firstName:firstName,
            lastName:lastName, 
            email: email,
            password: password,
            phone:phone,
            role:"user",
            isVerified:true,
            }
        );
        await saveUser.save()
        const accessToken = saveUser.generateAccessToken();
        const refreshToken = saveUser.generateRefreshToken();

    // Persist refresh token; password isn't modified so pre-save won't rehash
        saveUser.refreshToken = refreshToken;
        await saveUser.save({ validateBeforeSave: false });

        await Verification.deleteOne({ _id: verificationRecord._id });

        res.status(201).json({
        success: true,
        message: 'success',
        data: {
            user: {
                id: saveUser._id,
                firstName: saveUser.firstName,
                lastName: saveUser.lastName,
                email: saveUser.email,
                phone: saveUser.phone
            },
            accessToken,
            refreshToken
        }
    });

}
 else{
    throw new ApiError(400,"Invalide OTP")
 }

});

export const resendOTP =asyncHandler( async (req, res)=>{
    const{firstName,email,phone} = req.body;
    console.log("resend otp body", req.body);
    if(!email && !phone){
        throw new ApiError(400,"email or phone number is required")
    }

    const otp = GenerateOtp();
    const mail_result = await verifyEmail(email,firstName,otp);

    if(mail_result.response.includes("250 2.0.0 OK")){
        const verificationRecord = await Verification.findOne({ email, phone });

        if(verificationRecord){
            verificationRecord.otp = otp.toString();
            verificationRecord.expiresAt = new Date(Date.now() + 10 * 60 * 1000);
            await verificationRecord.save();
            throw ApiResponse.Ok(res, null, "OTP resent successfully");
        }
        else{
            const userVerification = new Verification({
                email:email,
                phone:phone,
                otp:otp.toString(),
                expiresAt: new Date(Date.now() + 10 * 60 * 1000) // Expires in 10 minutes
              });
              
                await userVerification.save();
                throw ApiResponse.Ok(res, null, "OTP resent successfully");
        }
    }
    else{
        throw new ApiError(400,"Failed to send OTP");
    }


})



export const login = asyncHandler ( async(req, res)=>{
    const {email , phone, password} =req.body;
     console.log("req body",req.body);

     const detector = new DeviceDetector();

    if((email ==="" && phone ==="" ) && password === ""){
        throw new ApiError(400,"email or cannot be null")
    }

    let user;

    if(email){
      user = await User.findOne({email})
    }else{
      user = await User.findOne({phone})
    }

    if(!user){
          throw new ApiError(400,"User not registered with this creditials");
    }

    const isMatch = await user.isCorrectPassword(password);
    console.log("password match", isMatch);

    if (isMatch) {
        const accessToken = user.generateAccessToken();
        console.log("access token", accessToken);
        const device = req.headers['user-agent'];
        const deviceInfo = detector.detect(device);
        console.log("device info", deviceInfo);

        // Send success response once; do not throw after responding
        return ApiResponse.Ok(res, { email: user.email, token: accessToken }, "login success");
    }

    throw new ApiError(400, "Invalid Credentials");


});


export const forgotPassword = asyncHandler (async(req, res)=>{
        const {email,phone} = req.body;

        if(!email && !phone){
            throw new ApiError(400,"email or phone number required");
        }
        let user;
        if(email){
            user = await User.findOne({email});
        }else{
            user = await User.findOne({phone});
        }

        if(!user){
            throw new ApiError(400,"User not found with this creditials");
        }

        // Generate and send OTP for password reset, similar to registration flow
        const otp =GenerateOtp();
        const main_result = await verifyEmail(email,user.firstName,otp);

        if(main_result.response.includes("250 2.0.0 OK")){
              const verificationRecord = new Verification({
                email:email,
                phone:phone,
                otp:otp.toString(),
                expiresAt: new Date(Date.now() + 10 * 60 * 1000)
              })
              await verificationRecord.save();
              throw ApiResponse.Ok(res, null, "OTP sent to your email for password reset");
        }
        else{
            throw new ApiError(400,"Failed to send OTP for password reset");
        }
            

});

export const verifyOtpForPasswordReset = asyncHandler (async(req, res)=>{
    const {email,phone,newPassword,otp} = req.body;

    if(!email && !phone && !otp && !newPassword){
        throw new ApiError(400,"All fields are required");
    }

    const verificationRecord = await Verification.findOne({email,phone});
    console.log("verification record for password reset", verificationRecord);
    if(!verificationRecord){
        throw new ApiError(400,"Invalid OTP or OTP expired");
    }
    else if(!verificationRecord.CompareOTP(otp)){
        console.log("OTP comparison failed",verificationRecord.CompareOTP(otp));
        throw new ApiError(400,"Invalid OTP");
    }
    else {

    const user = await User.findOne({email,phone});

    if(!user){
        throw new ApiError(400,"User not found with this creditials");
    }
    user.password = newPassword;
    await user.save();
    
    // OTP should be single-use; remove after successful password reset
    await Verification.deleteOne({ _id: verificationRecord._id });

    ApiResponse.Ok(res,null, "Password reset successful");
}

});



export const resetPassword = asyncHandler (async(req, res)=>{
    const {_id,oldPassword,newPassword} = req.body;

    const user = await User.findOne(_id);
    if(user.isCorrectPassword(oldPassword)){
        await user.updateOne({password:'newPaaword'})
    }
    else{
        throw new ApiError(409,"Invalid Old Password")
    }

});



