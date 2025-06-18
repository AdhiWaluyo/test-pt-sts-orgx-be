import { body, FieldValidationError, validationResult } from "express-validator";
import { Request, Response, NextFunction, RequestHandler } from "express";

export const updateProfileValidation: RequestHandler[] = [
	body('name')
		.trim()
		.notEmpty()
		.withMessage('User Name is required'),

	body('phoneNumber').trim(),

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