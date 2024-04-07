import bcrypt from 'bcryptjs';
import { TryCatch } from '../middlewares/error.js';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import ErrorHandler from '../utils/utility-class.js';
const newUser = TryCatch(async (req, res, next) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return next(new ErrorHandler('All fields are required', 400));
    }
    const registeredUser = await User.findOne({ email }).select('-password');
    if (registeredUser) {
        return next(new ErrorHandler(`User already exists, please login ${registeredUser.name}`, 409));
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });
    generateToken(res, user._id);
    return res.status(201).json({
        success: true,
        message: 'Registered successfully',
        user,
    });
});
const loggedInUser = TryCatch(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorHandler('All fields are required', 400));
    }
    const user = await User.findOne({ email });
    if (!user) {
        return next(new ErrorHandler('Invalid credentials!', 401));
    }
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
        return next(new ErrorHandler('Invalid credentials', 401));
    }
    generateToken(res, user._id);
    return res.status(200).json({
        success: true,
        message: `Welcome ${user.name}`,
        user,
    });
});
const logOutUser = TryCatch(async (req, res, next) => {
    return res.clearCookie('token').status(200).json({
        success: true,
        message: 'Logged out successfully',
    });
});
const updateUser = TryCatch(async (req, res, next) => {
    const { name, password, imageUrl } = req.body;
    if (!name || !imageUrl || !password) {
        return next(new ErrorHandler('All fields are required', 400));
    }
    const { id } = req.params;
    if (req.user?.id !== id) {
        return next(new ErrorHandler('Unauthorized', 401));
    }
    const user = await User.findById(id);
    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }
    user.name = name;
    user.imageUrl = imageUrl;
    const hashedPassword = bcrypt.hashSync(password, 10);
    user.password = hashedPassword;
    const updatedUser = await user.save();
    return res.status(200).json({
        success: true,
        message: 'User updated successfully',
        updatedUser,
    });
});
export { loggedInUser, logOutUser, newUser, updateUser };
