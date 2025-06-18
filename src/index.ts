import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import userRoutes from "./app/users/user.route";
import authRoutes from "./app/auth/auth.route";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes

// Auth Routes
app.use("/api/v1", authRoutes);

// User Routes
app.use("/api/v1/users", userRoutes);

const PORT = process.env.APP_PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});
