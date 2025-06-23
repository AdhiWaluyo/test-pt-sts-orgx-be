import { body, FieldValidationError, validationResult } from "express-validator";
import { Request, Response, NextFunction, RequestHandler } from "express";
import db from "@/utils/db.server";
import { isNotEmpty, validateRegionByRole } from "@/utils/helper";
import regionEnum from "@/enums/region.enum";

export const updateUserValidation: RequestHandler[] = [
	// roleId
	body('roleId')
		.notEmpty()
		.withMessage('Role is required')
		.bail()
		.isInt()
		.bail()
		.custom(async (roleId, { req }) => {
			if (!Number.isInteger(roleId)) {
				throw new Error('roleId must be an integer');
			}

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
				throw new Error(err)
			};

			return true;
		}),

	// provinceId
	body("provinceId")
		.optional({ nullable: true })
		.isInt()
		.bail()
		.custom(async (provinceId) => {
			if (provinceId == null) {
				return true
			};

			if (!Number.isInteger(provinceId)) {
				throw new Error('provinceId must be an integer');
			}

			const province = await db.region.findFirst({
				where: {
					id: provinceId,
					type: regionEnum.PROVINCE,
					deletedAt: null,
				},
				select: {
					id: true,
				},
			});

			if (!province) {
				throw new Error("Invalid province");
			}

			return true;
		}),

	body("cityId")
		.optional({ nullable: true })
		.isInt()
		.bail()
		.custom(async (cityId, { req }) => {
			if (cityId == null) {
				return true
			};

			if (!Number.isInteger(cityId)) {
				throw new Error('cityId must be an integer');
			}

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
		.optional({ nullable: true })
		.isInt()
		.bail()
		.custom(async (districtId, { req }) => {
			if (districtId == null) {
				return true
			};

			if (!Number.isInteger(districtId)) {
				throw new Error('districtId must be an integer');
			}

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
		.optional({ nullable: true })
		.isInt()
		.bail()
		.custom(async (villageId, { req }) => {
			if (villageId == null) {
				return true
			};

			if (!Number.isInteger(villageId)) {
				throw new Error('villageId must be an integer');
			}

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
			const user = await db.user.findFirst({
				where: {
					username: value,
					deletedAt: null
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