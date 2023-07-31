import express from "express";
import {
    getAdminStats,
    getAdminUsers,
    login,
    myProfile,
    register,
} from "../controllers/user.js";
import { authorizeAdmin, isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

router.get("/me", isAuthenticated, myProfile);

// Admin Routes
router.get("/admin/users", isAuthenticated, authorizeAdmin, getAdminUsers);

router.get("/admin/stats", isAuthenticated, authorizeAdmin, getAdminStats);

export default router;