import { Response } from "express";
import userService from "./user.service";
import { messages } from "@/lang";
import { HttpStatusCode } from "@/enums/http-status-code.enum";
import { transformUser } from "./user.transformer";
import { AuthenticatedRequest } from "general.type";

/**
 * Handles user list request.
 *
 * Responds with 200 Ok and user list data.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 */
const list = async (req: AuthenticatedRequest, res: Response) => {
	try {

		// Get users
		const { users, meta } = await userService.list(req.query);

		// Respond with 200 Ok
		res.status(HttpStatusCode.Ok).json({
			message: messages.success,
			data: users,
			meta,
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
 * Handles user get one request.
 *
 * Responds with 200 Ok and user data.
 * Responds with 404 Not Found if user is not found.
 * Responds with 500 Internal Server Error if an error occurs.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 */
const getOne = async (req: AuthenticatedRequest, res: Response) => {
	try {

		// Get user
		const user = await userService.getOne(parseInt(req.params.id));

		// Respond with 200 Ok
		if (!user) {
			res.status(HttpStatusCode.NotFound).json({
				message: messages.httpNotFound
			});
			return
		}

		// Respond with 200 Ok
		const transformedUser = transformUser(user);

		// Respond with 200 Ok
		res.status(HttpStatusCode.Ok).json({
			message: messages.success,
			data: transformedUser,
		});
	} catch (error) {
		console.log(error);

		// Respond with 500 Internal Server Error
		res.status(HttpStatusCode.InternalServerError).json({
			message: messages.httpInternalServerError
		});
	}
}

/**
 * Handles user creation request.
 *
 * Request body must contain user data to be created.
 *
 * Responds with 201 Created and the created user data.
 * Responds with 500 Internal Server Error if an error occurs.
 *
 * @param req - Express request object, containing user data in the body.
 * @param res - Express response object.
 */
const create = async (req: AuthenticatedRequest, res: Response) => {
	try {

		// Create user
		const user = await userService.create(req.body, req.user);

		// Transform user
		const transformedUser = transformUser(user);

		// Respond with 201 Created
		res.status(HttpStatusCode.Created).json({
			message: messages.dataSaved,
			data: transformedUser,
		});
	} catch (error) {
		console.log(error);

		// Respond with 500 Internal Server Error
		res.status(HttpStatusCode.InternalServerError).json({
			message: messages.httpInternalServerError
		});
	}
}

/**
 * Handles user update request.
 *
 * Checks if the user exists. If not, responds with 404 Not Found.
 * If the user exists, updates the user with the provided data.
 * Responds with 200 Ok and the updated user data if successful.
 * Responds with 500 Internal Server Error if an error occurs.
 *
 * @param req - Express request object, containing user data in the body and user ID in the params.
 * @param res - Express response object.
 */
const update = async (req: AuthenticatedRequest, res: Response) => {
	try {

		// Check if user exists
		const isExists = await userService.isExists(parseInt(req.params.id));

		// If user does not exist, respond with 404 Not Found
		if (!isExists) {
			res.status(HttpStatusCode.NotFound).json({
				message: messages.httpNotFound
			});
			return
		}

		// Update user
		const user = await userService.update(parseInt(req.params.id), req.body);

		// Transform user
		const transformedUser = transformUser(user);

		// Respond with 200 Ok
		res.status(HttpStatusCode.Ok).json({
			message: messages.dataSaved,
			data: transformedUser,
		});
	} catch (error) {
		console.log(error);

		// Respond with 500 Internal Server Error
		res.status(HttpStatusCode.InternalServerError).json({
			message: messages.httpInternalServerError
		});
	}
}

/**
 * Handles user deletion request.
 *
 * Checks if the user exists. If not, responds with 404 Not Found.
 * If the user exists, marks the user as deleted.
 * Responds with 200 Ok if the user is successfully marked as deleted.
 * Responds with 500 Internal Server Error if an error occurs.
 *
 * @param req - Express request object, containing user ID in the params.
 * @param res - Express response object.
 */

const remove = async (req: AuthenticatedRequest, res: Response) => {
	try {

		// Check if user exists
		const isExists = await userService.isExists(parseInt(req.params.id));

		// If user does not exist, respond with 404 Not Found
		if (!isExists) {
			res.status(HttpStatusCode.NotFound).json({
				message: messages.httpNotFound,
			});
			return
		}

		// Delete user
		await userService.remove(parseInt(req.params.id));

		// Respond with 200 Ok
		res.status(HttpStatusCode.Ok).json({
			message: messages.dataDeleted,
		});
	} catch (error) {
		console.log(error);

		// Respond with 500 Internal Server Error
		res.status(HttpStatusCode.InternalServerError).json({
			message: messages.httpInternalServerError
		});
	}
}

// Export user controller
const userController = {
	list,
	getOne,
	create,
	update,
	remove,
}

export default userController; 