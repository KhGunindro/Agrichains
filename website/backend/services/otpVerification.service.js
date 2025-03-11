import OTPmodel from '../model/otp.model.js';
import UserModel from '../model/user.model.js';
import CustomError from '../components/customError.component.js';
import jwt from 'jsonwebtoken';

// this needs to be reviewed
const OTPverification = async (req, res, next) => {
    try {
        const { otp, accountCredentials } = req.body; // sent the accountCredentails as an object
        if (!otp || typeof otp !== "string") throw new CustomError("Invalid OTP!", 401);
        if (!accountCredentials || typeof accountCredentials !== 'object') throw new CustomError("Invalid account credentials!", 401);

        // compare the otp
        const isValidOTP = await OTPmodel.findOne({ otp });
        if (!isValidOTP) throw new CustomError("Incorrect otp!", 409);

        // if everything goes right, create an account using the user's details
        const newUser = await UserModel.create({ ...accountCredentials });
        if (!newUser) throw new CustomError("An error occured while trying to create your account!", 500);

        // after the account is created, delete the otp model
        await isValidOTP.deleteOne();

        // generate a new token
        const token = jwt.sign({ accountId: newUser._id }, process.env.SECRET_KEY, { expiresIn: '1h' });

        return res.status(201).json({ message: "Account created successfully!", token });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

export default OTPverification;