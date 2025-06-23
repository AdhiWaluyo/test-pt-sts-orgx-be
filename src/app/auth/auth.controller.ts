import { Request, Response } from "express";
import authService from "./auth.service";
import { HttpStatusCode } from "@/enums/http-status-code.enum";
import { messages } from "@/lang";
import { ErrorCode } from "@/enums/erro-code.enum";
import { AuthenticatedRequest } from "general.type";

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
		const result = await authService.login(req.body);

		if (!result.success) {
			// If user is not found, respond with 400 Bad Request
			if (result.errorCode === ErrorCode.DATA_NOT_FOUND) {
				res.status(HttpStatusCode.BadRequest).json({
					message: 'User not found'
				});
				return;
			}

			// If password is incorrect, respond with 400 Bad Request
			if (result.errorCode === ErrorCode.INCORRECT_CREDENTIALS) {
				res.status(HttpStatusCode.BadRequest).json({
					message: 'Incorrect username or password'
				});
				return;
			}

			// If user is not active, respond with 400 Bad Request
			if (result.errorCode === ErrorCode.DATA_INACTIVE) {
				res.status(HttpStatusCode.BadRequest).json({
					message: 'User is not active'
				});
				return;
			}

			// Respond with 400 Bad Request
			res.status(HttpStatusCode.BadRequest).json({ message: 'Login failed' });
			return;
		}

		// Generate access token
		const { token, expiresAt } = await authService.generateAccessToken(result?.user);

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

const logout = async (req: AuthenticatedRequest, res: Response) => {
	try {
		const tokenId = req.user?.accessTokenId;

		if (!tokenId) {
			res.status(401).json({ message: "Invalid token" });
			return
		}

		// Logout
		const success = await authService.logout(tokenId);

		if (success) {
			res.status(HttpStatusCode.Ok).json({ message: "Success" });
			return
		} else {
			res.status(HttpStatusCode.BadRequest).json({ message: "Logout failed or already logged out" });
			return
		}
	} catch (error) {
		console.error(error);

		res.status(HttpStatusCode.InternalServerError).json({
			message: messages.httpInternalServerError,
		});
	}
};

// const logout = async (req: AuthenticatedRequest, res: Response) => {
// 	try {
// 		const authHeader = req.headers.authorization;
// 		const token = authHeader?.split(" ")[1];

// 		if (!token) {
// 			res.status(401).json({ message: "Missing token" });
// 			return;
// 		}

// 		const payload = await authService.verifyAccessToken(token);

// 		if (!payload) {
// 			res.status(401).json({ message: "Invalid or expired token" });
// 			return;
// 		}

// 		const success = await authService.logout(payload.jti as string);
// 		if (success) {
// 			res.status(200).json({ message: "Logout successful" });
// 			return
// 		} else {
// 			res.status(400).json({ message: "Logout failed or already logged out" });
// 			return
// 		}
// 	} catch (error) {
// 		console.error(error);
// 		res.status(500).json({ message: "Internal server error" });
// 	}
// };




// Export
const authController = {
	login,
	register,
	logout
}

export default authController;