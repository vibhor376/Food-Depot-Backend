import ErrorHandler from "../utils/ErrorHandler.js";
import jwt from "jsonwebtoken";
export const isAuthenticated = (req, res, next) => {
    try {
        const { token } = req.body;
        const decoded = jwt.verify(token, process.env.JWT_SECRET,)
        req.user = decoded.user;
        next();
    } catch (err) {
        return next(new ErrorHandler("Invalid Token", 401));
    }
};

export const authorizeAdmin = (req, res, next) => {
    // console.log(req.user.name);
    if (req.user.role !== "admin") {
        return next(new ErrorHandler("Only Admin Allowed", 405));
    }
    next();
};
