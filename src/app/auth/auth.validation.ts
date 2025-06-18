import { body, FieldValidationError, validationResult } from "express-validator";
import { Request, Response, NextFunction, RequestHandler } from "express";
import db from "@/utils/db.server";

// Login Validation
export const loginValidation: RequestHandler[] = [

	// Username
	body('username')
		.trim()
		.notEmpty()
		.withMessage('Username is required')
		.bail(),

	// Password
	body('password')
		.notEmpty()
		.withMessage('Password is required')
		.bail(),

	// Validation
	(req: Request, res: Response, next: NextFunction) => {

		// Check for errors
		const errors = validationResult(req);

		// If there are errors
		if (!errors.isEmpty()) {

			// Format errors
			const formattedErrors: Record<string, string[]> = {};

			// Loop through errors
			for (const error of errors.array()) {
				const err = error as FieldValidationError;
				if (!formattedErrors[err.path]) {
					formattedErrors[err.path] = [];
				}
				formattedErrors[err.path].push(err.msg);
			}

			// Respond with 400 Bad Request
			res
				.status(400)
				.json({
					message: "Invalid data",
					details: {
						errors: formattedErrors,
					},
				});
			return
		}

		next();
	},
];

// Register Validation
export const registerValidation = [

	// Email
	body('username')
		.trim()
		.notEmpty()
		.withMessage('Username is required')
		.bail()
		.custom(async value => {
			// Check if username already exists
			const user = await db.user.findUnique({
				where: {
					username: value
				},
				select: {
					id: true
				}
			});

			// If email already exists
			if (user) {
				throw new Error('Username already in use');
			}

			return true;
		}),

	// Password
	body('password')
		.notEmpty()
		.withMessage('Password is required')
		.bail()
		.isLength({ min: 6 })
		.withMessage('Password must be at least 6 characters long'),

	// Validation
	(req: Request, res: Response, next: NextFunction) => {

		// Check for errors
		const errors = validationResult(req);

		// If there are errors
		if (!errors.isEmpty()) {

			// Format errors
			const formattedErrors: Record<string, string[]> = {};

			// Loop through errors
			for (const error of errors.array()) {
				const err = error as FieldValidationError;
				if (!formattedErrors[err.path]) {
					formattedErrors[err.path] = [];
				}
				formattedErrors[err.path].push(err.msg);
			}

			// Respond with 400 Bad Request
			res
				.status(400)
				.json({
					message: "Invalid data",
					details: {
						errors: formattedErrors,
					},
				});
			return
		}

		next();
	},
];