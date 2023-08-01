import express, { urlencoded } from "express";
import dotenv from "dotenv";
import session from "express-session";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import cors from "cors";

const app = express();
export default app;
dotenv.config({
    path: "./config/config.env"
});

//Using middlewares
app.use(
    urlencoded({
        extended: true,
    })
);
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
)
app.use(express.json());

app.use(
    cors({
        credentials: true,
        origin: "https://fooddepot.vercel.app/",
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);

// Add the redirect rule to serve the frontend's index.html for all routes
app.get("*", (req, res) => {
    res.redirect("https://fooddepot.vercel.app/"); // Redirect to your frontend deployment URL
});

app.enable("trust proxy");

//Importing Routes
import userRoutes from "./routes/user.js"
import orderRoutes from "./routes/order.js"
import mailRoute from "./routes/mail.js"

app.use("/api/v1", userRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", mailRoute);

//Using Error middleware
app.use(errorMiddleware);

