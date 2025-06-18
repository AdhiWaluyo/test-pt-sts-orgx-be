import { body, FieldValidationError, validationResult } from "express-validator";
import { Request, Response, NextFunction, RequestHandler } from "express";
import db from "@/utils/db.server";
import { isNotEmpty } from "@/utils/helper";

export const updateUserValidation: RequestHandler[] = [
	// role_id
	body('role_id')
		.notEmpty()
		.withMessage('Role is required')
		.bail()
		.isInt()
		.custom(async roleId => {
			const role = await db.role.findUnique({
				where: {
					id: roleId,
					deletedAt: null
				},
				select: {
					id: true,
				}
			});

			if (!role) {
				throw new Error('Invalid role');
			}

			return true
		}),

	// region_id
	body('region_id')
		.notEmpty()
		.withMessage('Region is required')
		.bail()
		.isInt()
		.custom(async regionId => {
			const region = await db.region.findUnique({
				where: {
					id: regionId,
					deletedAt: null
				},
				select: {
					id: true,
				}
			});

			if (!region) {
				throw new Error('Invalid region');
			}

			return true
		}),


	(req: Request, res: Response, next: NextFunction) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			const formattedErrors: Record<string, string[]> = {};

			for (const error of errors.array()) {
				const err = error as FieldValidationError;
				if (!formattedErrors[err.path]) {
					formattedErrors[err.path] = [];
				}
				formattedErrors[err.path].push(err.msg);
			}
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

export const createUserValidation: RequestHandler[] = [

	// Username
	body('username')
		.trim()
		.notEmpty()
		.withMessage('Username is required')
		.bail()
		.custom(async (value, { req }) => {

			// Check if email already exists
			const user = await db.user.findUnique({
				where: {
					username: value
				},
				select: {
					id: true,
				}
			});

			// If email already exists
			if (isNotEmpty(user)) {
				throw new Error('Email already in use');
			}

			return true;
		}),

	// Password
	body('password')
		.notEmpty()
		.withMessage('Password is required')
		.bail()
		.custom(async (value, { req }) => {

			// Check password length
			if (value && value.length < 6) {
				throw new Error('Password must be at least 6 characters long');
			}

			return true;
		}),
	...updateUserValidation,
]