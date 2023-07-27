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
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);

app.enable("trust proxy");

//Importing Routes
import userRoutes from "./routes/user.js"
import orderRoutes from "./routes/order.js"
app.use("/api/v1", userRoutes);
app.use("/api/v1", orderRoutes);

//Using Error middleware
app.use(errorMiddleware);