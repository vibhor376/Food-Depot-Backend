export const errorMiddleware = (err, req, res, next) => {
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;
    // console.log(res);
    res.status(err.statusCode).json({
        success: false,
        error: err,
        // res: res,
        message: err.message,
    });
};

export const asyncError = (passedFunction) => (req, res, next) => {
    Promise.resolve(passedFunction(req, res, next)).catch(next);
};