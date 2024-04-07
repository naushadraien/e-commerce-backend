import { TryCatch } from "../middlewares/error.js";
import ErrorHandler from "../utils/utility-class.js";
import User from "../models/User.js";
const newUser = TryCatch(async (req, res, next) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return next(new ErrorHandler("All fields are required", 400));
    }
    const registeredUser = await User.findOne({ email }).select("-password");
    if (registeredUser) {
        return next(new ErrorHandler("Email already exists, please login", 400));
    }
    const user = await User.create({
        name,
        email,
        password,
    });
    return res.status(201).json({
        success: true,
        message: "Registered successfully",
        user,
    });
});
export { newUser };
