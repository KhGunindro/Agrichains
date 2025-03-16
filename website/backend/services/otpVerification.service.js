import OTPmodel from '../model/otp.model.js';
import UserModel from '../model/user.model.js';
import CustomError from '../components/customError.component.js';
import jwt from 'jsonwebtoken';
import Mailer from '../lib/nodemailer.middleware.js';

// this needs to be reviewed
const OTPverification = async (req, res, next) => {
    try {
        // decode the incoming token and extract accountDetail from it
        const authHeader = req.headers['authorization'];
        if (!authHeader) throw new CustomError("Auth header is requied!", 400);
        const incomingToken = authHeader && authHeader.split(' ')[1];
        if (!incomingToken || typeof incomingToken !== 'string') throw new CustomError("Token is required!", 400);

        // check if the token is valid or not
        const isValidToken = jwt.verify(incomingToken, process.env.SECRET_KEY);
        if (!isValidToken) throw new CustomError("Incorrect token!", 409);

        // if the token is valid, extract 'accountDetail' from the token
        const accountDetail = isValidToken.accountDetail;
        if (!accountDetail || typeof accountDetail !== 'object') throw new CustomError("Invalid account credentials!", 401);

        const { otp } = req.body; // sent the accountCredentails as an object
        if (!otp || typeof otp !== "string") throw new CustomError("Invalid OTP!", 401);

        // compare the otp
        const isValidOTP = await OTPmodel.findOne({ otp });
        if (!isValidOTP) {
            res.cookie("verificationToken", "", { maxAge: 0 }); // remove the cookie if the token is incorrect
            throw new CustomError("Incorrect otp!", 409);
        }

        // if everything goes right, create an account using the user's details
        const newUser = await UserModel.create({ ...accountDetail });
        if (!newUser) throw new CustomError("An error occured while trying to create your account!", 500);

        // after the account is created, delete the otp model
        await isValidOTP.deleteOne();
        res.cookie("verificationToken", "", { maxAge: 0 }); // remove the old token which has the account credential

        // generate a new token
        const token = jwt.sign({ accountId: newUser._id }, process.env.SECRET_KEY, { expiresIn: '1h' });

        // after successfull otp verification, send email
        const mailer = new Mailer();
        const mailBody = {
            to: newUser.email,
            subject: "Welcome to our platform!",
            text: `Hello ${newUser.username}, welcome to our platform! Your account has been created successfully. Explore our platform and enjoy! \n\nThanks, team FUTURE.`,
        }
        await mailer.sentMail(mailBody.to, mailBody.subject, mailBody.text); // send welcome email to our new user

        return res.status(201).json({ message: "Account created successfully!", token });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

export default OTPverification;