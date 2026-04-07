import { asyncHandler } from '../utils/asyncHandler.js';
import ApiError from '../utils/apiError.js';
import User from '../models/user.models.js';
import ApiResponse from  '../utils/apiResponse.js';
import DeviceDetector from 'node-device-detector';
import { verifyEmail } from '../utils/mail.service.js';
import GenerateOtp from '../utils/otp.js';
import { Verification } from '../models/verification.model.js';
import jwt from 'jsonwebtoken';
import { options } from '../constants.js';
import { OAuth2Client } from 'google-auth-library';

export const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email,phone, password } = req.body;
    // console.log("body ", req.body);

    // Basic safety: should never hit because Joi runs first, but keep guard
    if ([firstName, lastName, email,phone, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "all fields are required");
    }

    const existUser = await User.findOne({
        $or :[{ email , phone }]
    });
    // console.log("exist user",existUser);
    if(existUser){
        throw new ApiError(409,"User Already Exist")
       
    }
    
    
    const otp = GenerateOtp();

    const mail_result = await verifyEmail(email,firstName,otp)

    // console.log("mail_result", mail_result);

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
    // console.log("resend otp body", req.body);
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

export const socialLogin = asyncHandler (async(req, res)=>{
    try {
        const {provider,token}= req.body;

        if(!provider || !token){
            throw new ApiError(400,"Provider and token are required for social login");
        }

        

    } catch (error) {
        throw new ApiError(500,"Failed to login with social provider");
    }
});


// generate Access token and refresh token , method 

async function generateTokens(user)  {
    try {

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({validationBeforeSave:false});
        return {accessToken, refreshToken};

    } catch (error) {
        throw new ApiError(500,"Failed to generate tokens");
    }
}

export const login = asyncHandler ( async(req, res)=>{
    const {email , phone, password} =req.body;
    //  console.log("req body",req.body);

     const detector = new DeviceDetector();

    if((!email && !phone ) && !password){
        throw new ApiError(400,"email or cannot be null")
    }

    const user = await User.findOne({
        $or :[{email} , {phone}]
    })




    if(!user){
          throw new ApiError(400,"User not registered with this creditials");
    }

    if(user.isSuspended){
        throw new ApiError(403,"Your account has been suspended. Please contact support for assistance.");
    }
    

    const isMatch = await user.isCorrectPassword(password);
    // console.log("password match", isMatch);
    console.log("is match", isMatch);
    if (isMatch) {
        const {accessToken, refreshToken} = await generateTokens(user);
        console.log("access token", accessToken);
        const device = req.headers['user-agent'];
        const deviceInfo = detector.detect(device);
        console.log("device info", deviceInfo);
        
        const loginRecord = await User.findById(user._id).select("-password -refreshToken");
        console.log("login record before update", loginRecord);
        loginRecord.isLoggedIn = true;
        await loginRecord.save();
      
        
        // Send success response once; do not throw after responding
        return res
               .status(200)
               .cookie('accessToken',accessToken,options)
               .cookie('refreshToken',refreshToken,options)
               .json(
                new ApiResponse(200,{loginRecord,accessToken} , "login success")
               );
    }
    else{
    throw new ApiError(400, "Invalid Credentials");
    }

});

export const logout =asyncHandler (async(req, res)=>{
      await User.findByIdAndUpdate(req.user._id, {isLoggedIn: false, refreshToken: null}, {new: true});
      
      

      res.status(200)
      .clearCookie("accessToken",options)
      .clearCookie("refreshToken",options)
      .json(
        new ApiResponse(200,{},"Logout successful") 
    );
})

export const refreshAcessToken = asyncHandler(async(req, res)=>{
     try {
        const incomingRefreshToken = req.cookies?.refreshToken || req.header("Authorization")?.replace("Bearer ","");
   
        if(!incomingRefreshToken){
           throw new ApiError(401,"Unauthorized Request");
        }
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id) 
        if(!user){
           throw new ApiError(401,"Invalid Request Token");
        }
   
        if(user.refreshToken !== incomingRefreshToken){
           throw new ApiError(401,"Invalid Request Token");
        }
        
        const {accessToken, newRefreshToken} = await generateTokens(user);
       
   
        return res.status(200)
        .cookie('accessToken',accessToken,options)
        .cookie('newRefreshToken',newRefreshToken,options)
        .json(
           new ApiResponse(200,{accessToken, newRefreshToken}, "Access token refreshed successfully")
        )
     } catch (error) {
        throw new ApiError(401,error.message || "Invalid Request Token");
     }


})


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


export const changePassword = asyncHandler (async(req, res)=>{
    const _id = req.user._id;
    const {oldPassword,newPassword} = req.body;
     
    if(!oldPassword || !newPassword){
        throw new ApiError(400,"Old password and new password are required");
    }   
    const user = await User.findById(_id);
    if(!user){
        throw new ApiError(400,"user not found with this creditials");
    }
    if(oldPassword === newPassword){
        throw new ApiError(400,"New password cannot be same as old password");
    }
    if(user.isCorrectPassword(oldPassword)){
        
        // await user.updateOne({password:'newPaaword'})
        // await User.findByIdAndUpdate(_id,{password:newPassword,isLoggedIn:false, refreshToken:null},{new:true}); 
        user.password = newPassword;
        user.isLoggedIn = false;
        user.refreshToken = null;
        await user.save({validateBeforeSave:false});  

       
        return res.status(200)
        .clearCookie("accessToken",options)
        .clearCookie("refreshToken",options )
        .json(
            new ApiResponse(200,{},"password changed successfully")
        )
    }
    else{
        throw new ApiError(409,"Invalid Old Password")
    }

   
});

export const deactivateAccount = asyncHandler (async(req,res)=>{
    const _id = req.user._id;

    const user = await User.findByIdAndUpdate(_id,{isActive:false,isLoggedIn:false,refreshToken:null},{new:true});

    if(!user){
        throw new ApiError(400,"User not found with this creditials");
    }
    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(200,{},"Account deactivated successfully")
    )
    
});

export const submitKyc = asyncHandler (async(req, res)=>{

});


// Admin  contollers for user management like suspend, unsuspend, delete user can be implemented here with appropriate role checks in middleware.

export const adminLogin = asyncHandler( async(req, res)=>{
    const {email,phone, password} = req.body;

        if(req.path !== "/admin/login"){
             throw new ApiError(400,"Invalid Admin Login Route");
        }
        
        if(!email && !phone && !password){
            throw new ApiError(400,"email or phone number and password are required");
        }

        const user = await User.findOne({
            $and:[{email,phone},{role:"admin"}]
        })

        if(!user){
            throw  new ApiError(400, "Admin creditials are invalid");
        }
        
        const isMatch = await user.isCorrectPassword(password);
        if(isMatch){
            const accessToken = user.generateAccessToken();
            const refreshToken = user.generateRefreshToken();

            user.refreshToken = refreshToken;
            await user.save({validateBeforeSave:false});
            const loggedInUser = user.toObject();
            delete loggedInUser.password;
            delete loggedInUser.refreshToken;

            return res.status(200)
            .cookie('accessToken',accessToken,options)
            .cookie('refreshToken',refreshToken,options)
            .json(
                new ApiResponse(200, "Admin login successful",loggedInUser)
            )
        }
        else{
            throw new ApiError(400,"Invalid Admin Credentials");
        }

});

export const adminSignup = asyncHandler (async(req,res)=>{
    const {firstName, lastName, email, phone, password ,adminKey} = req.body;
      console.log("admin signup body", req.body);   
    if([firstName, lastName,email, phone, password,adminKey].some(field => field?.trim() === "")){
        throw new ApiError(400,"All fields are required");
    }
    if(adminKey !== process.env.ADMIN_KEY){
        throw new ApiError(403,"Invalid Admin Key");
    }

    const existAdmin = await User.findOne({
        $or:[{email}, {phone}]
    });

    if(existAdmin){
        throw new ApiError(409,"Admin with this email or phone already exists");
    }
    const newAdmin = new User({
        firstName,
        lastName,
        email,
        phone,
        password,
        role:"admin",
        isVerified:true
    });

    await newAdmin.save();

    const accessToken = newAdmin.generateAccessToken();
    const refreshToken = newAdmin.generateRefreshToken();

    newAdmin.refreshToken = refreshToken;
    await newAdmin.save({validateBeforeSave:false})
    const adminResponse = newAdmin.toObject();

    delete adminResponse.password;
    delete adminResponse.refreshToken;

    return res.status(201)
    .cookie('accessToken',accessToken,options)
    .cookie('refreshToken',refreshToken,options)
    .json(
        new ApiResponse(201, "Admin account created successfully", adminResponse)
    )   
});

export const adminLogout = asyncHandler (async(req, res)=>{
    const _id = req.user._id;
    const admin  = await User.findByIdAndUpdate(_id,{isLoggedIn:false, refreshToken:null},{new:true});

    if(!admin){
        throw new ApiError(400, "Admin not fount with this creditials");
    }
    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(200,{},"Admin logged out successfully")
    );
});

export const verifyKYC = asyncHandler(async(req, res)=>{
    
});




