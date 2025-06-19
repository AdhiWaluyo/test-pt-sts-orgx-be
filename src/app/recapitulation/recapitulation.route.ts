import express from "express";
import { authMiddleware } from "@/middlewares/auth.middleware";
import recapitulationController from "./recapitulation.controller";

const recapitulationRoutes = express
	.Router()
	.use(authMiddleware);

recapitulationRoutes
	.route("/")
	.get(recapitulationController.list);

recapitulationRoutes
	.route("/export")
	.get(recapitulationController.exportFile);


export default recapitulationRoutes;
