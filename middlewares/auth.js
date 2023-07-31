import ErrorHandler from "../utils/ErrorHandler.js";
import jwt from "jsonwebtoken";
export const isAuthenticated = async (req, res, next) => {
    const token = req.header('auth-token');
    // console.log(token);
    if (!token) {
        return res.status(401).send({
            err: "Not Logged In!!"
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
    } catch (err) {
        return next(new ErrorHandler("Not Logged In!!", 401));
    }
    next();
};

export const authorizeAdmin = (req, res, next) => {
    // console.log(req.user.name);
    if (req.user.role !== "admin") {
        return next(new ErrorHandler("Only Admin Allowed", 405));
    }
    next();
};
