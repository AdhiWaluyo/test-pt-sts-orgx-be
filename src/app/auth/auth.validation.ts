import { body, FieldValidationError, validationResult } from "express-validator";
import { Request, Response, NextFunction, RequestHandler } from "express";
import db from "@/utils/db.server";
import regionEnum from "@/enums/region.enum";
import { validateRegionByRole } from "@/utils/helper";

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
			const user = await db.user.findFirst({
				where: {
					username: value,
					deletedAt: null
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

	// roleId
	body('roleId')
		.notEmpty()
		.withMessage('Role is required')
		.bail()
		.isInt()
		.custom(async (roleId, { req }) => {
			const role = await db.role.findFirst({
				where: {
					id: roleId,
					deletedAt: null
				},
				select: {
					id: true
				},
			});

			if (!role) {
				throw new Error('Invalid role')
			};

			const err = validateRegionByRole(Number(roleId), req.body);
			if (err) {
				throw new Error(err);
			};

			return true;
		}),

	// provinceId
	body("provinceId")
		.optional()
		.isInt()
		.custom(async provinceId => {
			const province = await db.region.findFirst({
				where: {
					id: provinceId,
					type: regionEnum.PROVINCE,
					deletedAt: null
				},
				select: {
					id: true,
				}
			});

			if (!province) {
				throw new Error('Invalid province');
			}

			return true;
		}),

	body("cityId")
		.optional()
		.isInt()
		.custom(async (cityId, { req }) => {
			const { provinceId } = req.body;

			const city = await db.region.findFirst({
				where: {
					id: cityId,
					type: regionEnum.CITY,
					deletedAt: null,
				},
				select: {
					id: true,
					provinceId: true,
				}
			});

			if (!city) {
				throw new Error("Invalid city");
			}

			if (city.provinceId !== Number(provinceId)) {
				throw new Error("City does not belong to the selected province");
			}

			return true;
		}),

	body("districtId")
		.optional()
		.isInt()
		.custom(async (districtId, { req }) => {
			const { provinceId, cityId } = req.body;

			const district = await db.region.findFirst({
				where: {
					id: districtId,
					type: regionEnum.DISTRICT,
					deletedAt: null,
				},
				select: {
					id: true,
					provinceId: true,
					cityId: true,
				}
			});

			if (!district) {
				throw new Error("Invalid district");
			}

			if (district.cityId !== Number(cityId)) {
				throw new Error("District does not belong to the selected city");
			}

			if (district.provinceId !== Number(provinceId)) {
				throw new Error("District does not belong to the selected province");
			}

			return true;
		}),

	// village_id
	body("villageId")
		.optional()
		.isInt()
		.custom(async (villageId, { req }) => {
			const { districtId, cityId, provinceId } = req.body;

			const village = await db.region.findFirst({
				where: {
					id: villageId,
					type: regionEnum.VILLAGE,
					deletedAt: null,
				},
				select: {
					id: true,
					districtId: true,
					cityId: true,
					provinceId: true,
				}
			});

			if (!village) {
				throw new Error("Invalid village");
			}

			if (village.districtId !== Number(districtId)) {
				throw new Error("Village does not belong to the selected district");
			}

			if (village.cityId !== Number(cityId)) {
				throw new Error("Village does not belong to the selected city");
			}

			if (village.provinceId !== Number(provinceId)) {
				throw new Error("Village does not belong to the selected province");
			}

			return true;
		}),

	// // regionId
	// body('regionId')
	// 	.notEmpty()
	// 	.withMessage('Region is required')
	// 	.bail()
	// 	.isInt()
	// 	.custom(async (regionId, { req }) => {
	// 		const roleId = parseInt(req.body.roleId);

	// 		const region = await db.region.findFirst({
	// 			where: {
	// 				id: regionId,
	// 				deletedAt: null
	// 			},
	// 			select: {
	// 				id: true,
	// 				type: true
	// 			}
	// 		});

	// 		if (!region) {
	// 			throw new Error('Invalid region');
	// 		}

	// 		if (roleId === roleEnum.PROVINCIAL_ADMIN && region.type !== regionEnum.PROVINCE) {
	// 			throw new Error('Region is not a province');
	// 		}

	// 		if (roleId === roleEnum.CITY_ADMIN && region.type !== regionEnum.CITY) {
	// 			throw new Error('Region is not a city');
	// 		}

	// 		if (roleId === roleEnum.DISTRICT_ADMIN && region.type !== regionEnum.DISTRICT) {
	// 			throw new Error('Region is not a district');
	// 		}

	// 		if (roleId === roleEnum.VILLAGE_ADMIN && region.type !== regionEnum.VILLAGE) {
	// 			throw new Error('Region is not a village');
	// 		}

	// 		return true
	// 	}),


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