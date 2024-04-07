import { ZodError } from "zod";
import ErrorHandler from "../utils/utility-class.js";
export function validateData(schema) {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.errors.map((issue) => issue.message);
                //or
                // const errorMessages = error.errors.map((issue) => ({
                //   message: `${issue.path.join(".")} is ${issue.message}`,
                // }));
                // Create a new ErrorHandler with the error messages
                const err = new ErrorHandler("Invalid data", 400, errorMessages);
                next(err);
            }
            else {
                // Pass other errors to the error handler
                next(error);
            }
        }
    };
}
