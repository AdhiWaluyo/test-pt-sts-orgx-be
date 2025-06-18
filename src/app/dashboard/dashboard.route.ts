import express from "express";
import dashboardController from "./dashboard.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

const dashboardRoutes = express
	.Router()
	.use(authMiddleware);

dashboardRoutes
	.route("/summaries")
	.get(dashboardController.summary);

dashboardRoutes
	.route("/charts")
	.get(dashboardController.chart);

export default dashboardRoutes;
