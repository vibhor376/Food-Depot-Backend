import express from "express";
import { contact } from "../controllers/mail.js";

const router = express.Router();

//Contact us route
router.post('/contact', contact);

export default router;