const errorMiddleware = (err, req, res, next) => {
    err.message || (err.message = "Internal server error");
    err.statusCode || (err.statusCode = 500);
    err.details || (err.details = undefined);
    if (err.name === "CastError")
        err.message = "Invalid Id";
    return res.status(err.statusCode).json({
        success: false,
        message: err.message,
        details: err.details,
    });
};
const TryCatch = (func) => (req, res, next) => {
    return Promise.resolve(func(req, res, next)).catch(next);
};
export { errorMiddleware, TryCatch };
