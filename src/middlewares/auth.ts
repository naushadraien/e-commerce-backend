import User from '../models/User.js';
import { CustomRequest, UserType } from '../types/types.js';
import ErrorHandler from '../utils/utility-class.js';
import { TryCatch } from './error.js';
import jwt, { JwtPayload } from 'jsonwebtoken';
const authenticateUser = TryCatch(async (req: CustomRequest<UserType>, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return next(new ErrorHandler('Unauthenticated', 400));
  }

  const decodedUser = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

  req.user = (await User.findById(decodedUser.userId).select('-password')) as UserType;
  next();
});

export { authenticateUser };
