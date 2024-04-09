import bcrypt from 'bcryptjs';
import { TryCatch } from '../middlewares/error.js';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import ErrorHandler from '../utils/utility-class.js';
import { CustomRequest, UserType } from '../types/types.js';
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
  const validPassword = bcrypt.compareSync(password, user.password as string);

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

const updateUser = TryCatch(async (req: CustomRequest<UserType>, res, next) => {
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

const getAllUsers = TryCatch(async (req: CustomRequest<UserType>, res, next) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const usersPromise = User.find({
    _id: {
      $ne: req.user?._id,
    },
  })
    .skip(skip)
    .limit(limit);

  const totalUserDataPromise = User.countDocuments({
    _id: {
      $ne: req.user?._id,
    },
  });

  const [users, totalUserData] = await Promise.all([usersPromise, totalUserDataPromise]);

  if (totalUserData === 0) {
    return next(new ErrorHandler('No user found', 404));
  }

  const totalPages = Math.ceil(totalUserData / limit);

  return res.status(200).json({
    success: true,
    users,
    totalUserData,
    totalPages,
  });
});

const updateUserRole = TryCatch(async (req: CustomRequest<UserType>, res, next) => {
  const { id } = req.params;
  const { role } = req.body;
  if (req.user?.role !== 'admin') {
    return next(new ErrorHandler('Not authorized as admin', 401));
  }
  const user = await User.findById(id);
  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }
  user.role = role;
  user.save();
  return res.status(200).json({
    success: true,
    message: 'Role updated successfully',
    user,
  });
});

export { loggedInUser, logOutUser, newUser, updateUser, getAllUsers, updateUserRole };
