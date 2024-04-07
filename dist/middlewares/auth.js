import User from '../models/User.js';
import ErrorHandler from '../utils/utility-class.js';
import { TryCatch } from './error.js';
import jwt from 'jsonwebtoken';
const authenticateUser = TryCatch(async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return next(new ErrorHandler('Unauthenticated', 400));
    }
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
    req.user = (await User.findById(decodedUser.userId).select('-password'));
    next();
});
export { authenticateUser };
