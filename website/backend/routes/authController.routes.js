import express from 'express'
import authController from "../services/authController.service.js";
import authMiddleware from '../lib/auth.middleware.js';
import OTPverification from '../services/otpVerification.service.js';

const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/signIn', authController.signIn);
router.post('/logout', authMiddleware.verifyToken, authController.logOut);

router.post('/signup/verify-otp', OTPverification); // OTP verification

export default router;