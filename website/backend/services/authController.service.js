import bcryptjs from 'bcryptjs';
import User from '../model/user.model.js'; // User model schema
import otpModel from '../model/otp.model.js'; // OTP model schema
import mongoose from 'mongoose';
import Mailer from '../lib/nodemailer.middleware.js';
import customError from '../components/customError.component.js';
import jwt from '../lib/auth.middleware.js'

class AuthController {
    async signIn(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || typeof email !== 'string') {
                throw new customError('Email is required', 400);
            }
            if (!password || typeof password !== 'string') {
                throw new customError('Password is required!', 400);
            }

            // Check if the email exists
            const isValidUser = await User.findOne({ email }).select("+password");
            if (!isValidUser) throw new customError("User not found", 404);

            // If the user is valid, check the hashed password
            const isValidPassword = await bcryptjs.compare(password, isValidUser.password);
            if (!isValidPassword) throw new customError("Incorrect password!", 409);

            // Generate JWT token
            const token = await jwt.generateToken({ userId: isValidUser._id });

            return res.status(200).json({ message: "Login successful!", token });
        } catch (error) {
            next(error);
        }
    }

    async signUp(req, res, next) {
        console.log("Signup service is processing...");

        try {
            const { username, email, password } = req.body;
            if (!username || typeof username !== 'string') throw new customError('Username is required', 400);
            if (!email || typeof email !== 'string') throw new customError("Email is required!", 400);
            if (!password || typeof password !== 'string') throw new customError("Password is required!", 400);

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) throw new customError("Invalid email format!", 400);

            // Check if the username already exists
            const isUsernameDuplicate = await User.findOne({ username });
            if (isUsernameDuplicate) throw new customError(`Username "${username}" already exists!`, 409);

            // Check if the email already exists
            const isEmailDuplicate = await User.findOne({ email });
            if (isEmailDuplicate) throw new customError(`Email "${email}" already exists!`, 409);

            const otp = Math.floor(100000 + Math.random() * 900000);
            await otpModel.create({ otp, expiresAt: new Date(Date.now() + 60000) }); // save the otp in the database, expires in 1 minute

            // If the username and email are unique, create an account and send the account details to the frontend in JWT format
            const hashedPassword = await bcryptjs.hash(password, 10);
            const newUser = new User({
                username,
                email,
                password: hashedPassword
            });

            const token = await jwt.generateToken({ accountDetail: newUser });

            const mailer = new Mailer();

            // mail body
            const mailBody = {
                to: email,
                subject: "Verify your account",
                text: `Hello ${username},\nPlease enter the OTP to complete the sign up process! \n\n OTP: ${otp}`
            }

            // Send verification email
            await mailer.sentMail(mailBody.to, mailBody.subject, mailBody.text);

            return res.status(201).json({ message: `OTP is sent to ${email}. Please verify the OTP to complete the signup process!`, verificationToken: token });
        } catch (error) {
            next(error);
        }
    }

    async logOut(req, res, next) {
        try {
            const userId = req.accountId;
            if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
                throw new customError("Invalid user!", 404);
            }

            const isValidUser = await User.findById(userId);
            if (!isValidUser) throw new customError("User not found", 404);

            res.cookie("token", "", { maxAge: 0 }); // Removes the cookie from the browser

            return res.status(200).json({ message: "Logout successful!" });
        } catch (error) {
            next(error);
        }
    }
}

const authController = new AuthController();
export default authController;