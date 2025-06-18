import { Request, Response } from "express";
import authService from "./auth.service";
import { HttpStatusCode } from "@/enums/http-status-code.enum";
import { messages } from "@/lang";

/**
 * Handles user login.
 *
 * Request body must contain 'username' and 'password' properties.
 *
 * If credentials are invalid, responds with 400 Bad Request.
 *
 * If credentials are valid, generates an access token and responds with 200 Ok.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 */
const login = async (req: Request, res: Response) => {
	try {

		// Get user
		const user = await authService.login(req.body);

		// If user is not found, respond with 400 Bad Request
		if (!user) {
			res.status(HttpStatusCode.BadRequest).json({
				message: 'Incorrect username or password'
			});
			return;
		}

		// Generate access token
		const { token, expiresAt } = await authService.generateAccessToken(user);

		// Respond with 200 Ok
		res.status(HttpStatusCode.Ok).json({
			message: messages.success,
			data: {
				accessToken: token,
				expiresIn: expiresAt.unix(),
			}
		})
	} catch (error) {
		console.log(error);

		// Respond with 500 Internal Server Error
		res.status(HttpStatusCode.InternalServerError).json({
			message: messages.httpInternalServerError
		});
	}
}

/**
 * Handles user registration.
 *
 * Request body must contain 'username', 'password', and optionally 'phoneNumber' properties.
 *
 * If registration is successful, responds with 200 Ok and user data.
 *
 * If an error occurs, responds with 500 Internal Server Error.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 */
const register = async (req: Request, res: Response) => {
	try {

		// Register user
		const user = await authService.register(req.body);

		// Respond with 200 Ok
		res.status(HttpStatusCode.Ok).json({
			message: messages.success,
			data: user,
		})
	} catch (error) {
		console.log(error);

		// Respond with 500 Internal Server Error
		res.status(HttpStatusCode.InternalServerError).json({
			message: messages.httpInternalServerError
		});
	}
}

// Export
const authController = {
	login,
	register,
}

export default authController;