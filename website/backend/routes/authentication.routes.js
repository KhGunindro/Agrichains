import bcyrptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../model/user.model.js' // user model schema

class authentication {
    customError(message, statusCode) {
        const error = new Error(message);
        error.statusCode = statusCode;
        return error;
    }

    async signIn(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || typeof email !== 'string') {
                throw this.customError('Email is required', 400);
            }
            if (!password || typeof password !== 'string') {
                throw this.customError('Password is required!', 400);
            }

            // check if the email exist
            const isValidUser = await User.findOne({ email });
            if (!isValidUser) throw this.customError("User not found", 404);

            // if the user is valid, check the hasshed password
            const isValidPassword = await bcyrptjs.compare(password, isValidUser.password);
            if (!isValidPassword) throw this.customError("Incorrect password!", 409);

            return res.status(200).json({ message: "Login successfull!" });
        } catch (error) {
            next(error);
        }
    }

    async signUp(req, res, next) {
        try {
            const { username, email, password } = req.body;
            if (!username || typeof username !== 'string') throw this.customError('Username is required', 400);
            if (!email || typeof email !== 'string') throw this.customError("Email is required!", 400);
            if (!password || typeof password !== 'string') throw this.customError("Password is required!", 400);

            // checking if the username already exist!
            const isUsernameDuplicate = await User.findOne({ username });
            if (isUsernameDuplicate) throw this.customError(`Username "${username}" already exist!`);

            // check if the email already exist!
            const isEmailDuplicate = await User.findOne({ email });
            if (isEmailDuplicate) throw this.customError(`Email "${email}" already exist!`);

            // if the username or email is unique, create an account using them
            // hasing the password first
            const hasshedPassword = await bcyrptjs.hash(password, 10);
            const newUser = new User({
                username,
                email,
                password: hasshedPassword
            });
            await newUser.save();

            return res.status(201).json({ message: "Account created successfully!", accountDetail: newUser });
        } catch (error) {
            next(error);
        }
    }

    async logOut(req, res, next) {
        try {

        } catch (error) {
            next(error);
        }
    }
}

export default authentication;