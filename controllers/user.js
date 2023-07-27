import { asyncError } from "../middlewares/errorMiddleware.js";
import { User } from "../models/User.js";
import { Order } from "../models/Order.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const myProfile = (req, res, next) => {
    console.log(req.user);
    res.status(200).json({
        success: true,
        user: req.user.id,
    });
};

export const register = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });
        const token = jwt.sign(
            { user: { name, email, role: newUser.role, id: newUser._id } },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h",
            });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully', token });
    } catch (err) {
        res.status(500).json({ message: 'Failed to register user' });
    }
}

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        // console.log(user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const token = jwt.sign(
            { user: { name: user.name, email, role: user.role, id: user._id } },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h",
            });
        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ message: 'Failed to login' });
    }
}

export const logout = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) return next(err);
        res.clearCookie("connect.sid", {
            secure: process.env.NODE_ENV === "development" ? false : true,
            httpOnly: process.env.NODE_ENV === "development" ? false : true,
            sameSite: process.env.NODE_ENV === "development" ? false : "none",
        });
        res.status(200).json({
            message: "Logged Out",
        });
    });
};

export const getAdminUsers = asyncError(async (req, res, next) => {
    const users = await User.find({});
    // console.log(users[0].name);
    res.status(200).json({
        success: true,
        users,
    });
});

export const getAdminStats = asyncError(async (req, res, next) => {
    const usersCount = await User.countDocuments();

    const orders = await Order.find({});

    const preparingOrders = orders.filter((i) => i.orderStatus === "Preparing");
    const shippedOrders = orders.filter((i) => i.orderStatus === "Shipped");
    const deliveredOrders = orders.filter((i) => i.orderStatus === "Delivered");

    let totalIncome = 0;

    orders.forEach((i) => {
        totalIncome += i.totalAmount;
    });

    res.status(200).json({
        success: true,
        usersCount,
        ordersCount: {
            total: orders.length,
            preparing: preparingOrders.length,
            shipped: shippedOrders.length,
            delivered: deliveredOrders.length,
        },
        totalIncome,
    });
});
