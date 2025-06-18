import { body, FieldValidationError, validationResult } from "express-validator";
import { Request, Response, NextFunction, RequestHandler } from "express";
import db from "@/utils/db.server";
import regionEnum from "@/enums/region.enum";

export const MemberValidation: RequestHandler[] = [
	// Nik 
	body('nik')
		.notEmpty().withMessage('NIK is required')
		.isLength({ min: 16, max: 16 }).withMessage('NIK must be exactly 16 digits')
		.isNumeric().withMessage('NIK must contain only numbers')
		.custom(nik => {
			if (!/^[0-9]{16}$/.test(nik)) {
				throw new Error('Invalid NIK format');
			}
			return true;
		}),

	// Name
	body('name')
		.trim()
		.notEmpty()
		.withMessage('Name is required'),

	// phone 
	body('phone')
		.notEmpty().withMessage('Phone number is required')
		.isLength({ min: 10, max: 13 }).withMessage('Phone number must be between 10 and 13 digits')
		.custom(phone => {
			if (!/^[0-9]{10,13}$/.test(phone)) {
				throw new Error('Invalid phone number format');
			}
			return true;
		}),

	// province_id
	body("province_id")
		.notEmpty()
		.withMessage("Province is required")
		.bail()
		.isInt()
		.custom(async provinceId => {
			const province = await db.region.findUnique({
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

	// city_id
	body("city_id")
		.notEmpty()
		.withMessage("City is required")
		.bail()
		.isInt()
		.custom(async cityId => {
			const city = await db.region.findUnique({
				where: {
					id: cityId,
					type: regionEnum.CITY,
					deletedAt: null
				},
				select: {
					id: true,
				}
			});

			if (!city) {
				throw new Error('Invalid city');
			}

			return true;
		}),

	// district_id
	body("district_id")
		.notEmpty()
		.withMessage("District is required")
		.bail()
		.isInt()
		.custom(async districtId => {
			const district = await db.region.findUnique({
				where: {
					id: districtId,
					type: regionEnum.DISTRICT,
					deletedAt: null
				},
				select: {
					id: true,
				}
			});

			if (!district) {
				throw new Error('Invalid district');
			}

			return true;
		}),

	// village_id
	body("village_id")
		.notEmpty()
		.withMessage("Village is required")
		.bail()
		.isInt()
		.custom(async villageId => {
			const village = await db.region.findUnique({
				where: {
					id: villageId,
					type: regionEnum.VILLAGE,
					deletedAt: null
				},
				select: {
					id: true,
				}
			});

			if (!village) {
				throw new Error('Invalid village');
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
