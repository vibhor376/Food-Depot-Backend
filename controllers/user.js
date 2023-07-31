import { asyncError } from "../middlewares/errorMiddleware.js";
import { User } from "../models/User.js";
import { Order } from "../models/Order.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const myProfile = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            user: req.user,
        });
    } catch (error) {
        res.status(401).json({ message: 'Not Logged In!!' });
    }
};

export const register = async (req, res, next) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const securePass = await bcrypt.hash(req.body.password, salt);
        // console.log(email, securePass, name);

        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: securePass,
        });
        // console.log(newUser);
        const token = jwt.sign(
            {
                user:
                {
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                    id: newUser._id
                }
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h",
            });
        // await newUser.save();

        res.status(201).json({ message: 'User created successfully', token });
    } catch (err) {
        // console.error(err);
        res.status(500).json({ message: 'Failed to register user' });
    }
}

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(email, password);
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
            {
                user:
                {
                    name: user.name,
                    email,
                    role: user.role,
                    id: user._id
                }
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h",
            });
        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ message: 'Failed to login' });
    }
}



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
