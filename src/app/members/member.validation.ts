import { body, FieldValidationError, validationResult } from "express-validator";
import { Request, Response, NextFunction, RequestHandler } from "express";
import db from "@/utils/db.server";
import regionEnum from "@/enums/region.enum";
import { isNotEmpty } from "@/utils/helper";

export const memberValidation: RequestHandler[] = [
	// Nik 
	body('nik')
		.notEmpty().withMessage('NIK is required')
		.isLength({ min: 16, max: 16 }).withMessage('NIK must be exactly 16 digits')
		.isNumeric().withMessage('NIK must contain only numbers')
		.custom(async nik => {
			if (!/^[0-9]{16}$/.test(nik)) {
				throw new Error('Invalid NIK format');
			}

			const member = await db.member.findFirst({
				where: {
					nik,
					deletedAt: null
				},
				select: {
					id: true,
				}
			});

			if (isNotEmpty(member)) {
				throw new Error('NIK already exists');
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
		.bail()
		.isLength({ min: 10, max: 13 }).withMessage('Phone number must be between 10 and 13 digits')
		.custom(async phone => {
			if (!/^[0-9]{10,13}$/.test(phone)) {
				throw new Error('Invalid phone number format');
			}

			const member = await db.member.findFirst({
				where: {
					phone,
					deletedAt: null
				},
				select: {
					id: true,
				}
			});

			if (isNotEmpty(member)) {
				throw new Error('phone already exists');
			}

			return true;
		}),

	// provinceId
	body("provinceId")
		.notEmpty()
		.withMessage("Province is required")
		.bail()
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

	// cityId
	body("cityId")
		.notEmpty()
		.withMessage("City is required")
		.bail()
		.isInt()
		.custom(async cityId => {
			const city = await db.region.findFirst({
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

	// districtId
	body("districtId")
		.notEmpty()
		.withMessage("District is required")
		.bail()
		.isInt()
		.custom(async districtId => {
			const district = await db.region.findFirst({
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
	body("villageId")
		.notEmpty().withMessage("Village is required")
		.bail()
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
