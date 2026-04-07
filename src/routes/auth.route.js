
import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import * as authValidation from '../validations/auth.validation.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { auth } from 'google-auth-library';
const route = Router();

route.post('/register',authValidation.validateRegistringUser, authController.registerUser);
route.post('/login' ,authValidation.validateLoginCreditials ,authController.login);
route.post('/verify',authController.verifyOtp);
route.post('/resend-otp', authController.resendOTP);
route.post('/forgot-password',authController.forgotPassword);
route.post('/verify-otp-for-password-reset',authController.verifyOtpForPasswordReset);

// Protected route 
route.post('/logout',verifyJWT,authController.logout);
route.post('/refresh-token',authController.refreshAcessToken);
route.post('/change-password',verifyJWT,authController.changePassword);
route.post('/deactivate-account',verifyJWT,authController.deactivateAccount);

// admin routes for user management

route.post('/admin/signUP',authValidation.validateRegistringAdmin,authController.adminSignup);
route.post('/admin/login',authController.adminLogin);

export default route
