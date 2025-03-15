import jwt from 'jsonwebtoken'

class AuthMiddleware {
    customError(message, statusCode) {
        const error = new Error(message);
        error.statusCode = statusCode;
        return error;
    }

    async verifyToken(req, res, next) {
        try {
            const authHeader = req.headers['authorization'];
            if(!authHeader) throw this.customError("Invalid authHeader!", 400);
            const token = authHeader && authHeader.split(' ')[1];
            if(!token || typeof token !== 'string') throw this.customError("Invalid token!", 400);

            // check if the token is valid or not
            const isValidToken = jwt.verify(token, process.env.SECRET_KEY);
            if(!isValidToken) throw this.customError("Incorrect token!", 401);

            req.accountId = isValidToken.accountId;
            next();
        } catch (error) {
            next(error);
        }
    }

    async generateToken(payload) {
        return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' });
    }
}

const authMiddleware = new AuthMiddleware();
export default authMiddleware;