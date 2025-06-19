import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./app/auth/auth.route";
import regionRoutes from "./app/regions/region.route";
import memberRoutes from "./app/members/member.route";
import currentUserRoutes from "./app/current-user/current-user.route";
import dashboardRoutes from "./app/dashboard/dashboard.route";
import recapitulationRoutes from "./app/recapitulation/recapitulation.route";
import userRoutes from "./app/users/user.route";

dotenv.config();

const app = express();

app.use(cors(
	{
		origin: process.env.CORS_ORIGIN?.split(","),
		credentials: true,
	}
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes

// Auth Routes
app.use("/api/v1", authRoutes);

// User Routes
app.use("/api/v1/users", userRoutes);

// Current User Routes
app.use("/api/v1/me", currentUserRoutes);

// Region Routes
app.use("/api/v1/regions", regionRoutes);

// Member Routes
app.use("/api/v1/members", memberRoutes);

// Dashboard Routes
app.use("/api/v1/dashboards", dashboardRoutes);

// Recapitulation Routes
app.use("/api/v1/recapitulations", recapitulationRoutes);

const PORT = process.env.APP_PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});
