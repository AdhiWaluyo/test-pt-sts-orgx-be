import express from "express";
import dashboardController from "./dashboard.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

const dashboardRoutes = express
	.Router()
	.use(authMiddleware);

dashboardRoutes
	.route("/summaries/today")
	.get(dashboardController.summaryMemberToday);

dashboardRoutes
	.route("/charts")
	.get(dashboardController.chart);


dashboardRoutes
	.route("/total-member")
	.get(dashboardController.totalAllMember);

export default dashboardRoutes;
