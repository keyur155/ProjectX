
import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import * as authValidation from '../validations/auth.validation.js';
const route = Router();

route.post('/register',authValidation.validateRegistringUser, authController.registerUser);
route.post('/login' ,authValidation.validateLoginCreditials ,authController.login);
route.post('/verify',authController.verifyOtp);
route.post('/resend-otp', authController.resendOTP);
route.post('/forgot-password',authController.forgotPassword);
route.post('/verify-otp-for-password-reset',authController.verifyOtpForPasswordReset);


export default route
