import regionEnum from "@/enums/region.enum";
import db from "@/utils/db.server";
import { calculatePagination, calculateTotalPage, isNotEmpty } from "@/utils/helper";

/**
 * Handles region list request.
 *
 * Responds with 200 Ok and region list data.
 *
 * @param {Object} params - pagination parameters
 * @param {number} [params.page=1] - current page
 * @param {number} [params.perPage=15] - number of data per page
 * @returns {Promise<{ regions: Region[], meta: { currentPage: number, perPage: number, totalPage: number, totalData: number } }>}
 */
const listProvince = async (params: any) => {
	// Calculate pagination
	const { page, perPage, offset } = calculatePagination(params.page, params.perPage);

	// Get regions and total data
	const [regions, totalData] = await Promise.all([
		db.region.findMany({
			where: {
				type: regionEnum.PROVINCE,
				deletedAt: null,
			},
			take: perPage,
			skip: offset,
			select: {
				id: true,
				name: true,
				type: true,
				provinceId: true,
				cityId: true,
				districtId: true,
				createdAt: true,
				updatedAt: true,
			}
		}),
		db.region.count({
			where: {
				type: regionEnum.PROVINCE,
				deletedAt: null,
			}
		}),
	]);

	// Calculate total page
	const meta = {
		currentPage: page,
		perPage: perPage,
		totalPage: calculateTotalPage(totalData, perPage),
		totalData: totalData,
	}

	return { regions, meta };
}

const listByType = async (
	type: number,
	params: any,
	filter: Record<string, number> = {}
) => {
	const { page, perPage, offset } = calculatePagination(params.page, params.perPage);

	const [regions, totalData] = await Promise.all([
		db.region.findMany({
			where: {
				type,
				deletedAt: null,
				...filter,
			},
			take: perPage,
			skip: offset,
			select: {
				id: true,
				name: true,
				type: true,
				provinceId: true,
				cityId: true,
				districtId: true,
				createdAt: true,
				updatedAt: true,
			}
		}),
		db.region.count({
			where: {
				type,
				deletedAt: null,
				...filter,
			}
		}),
	]);

	const meta = {
		currentPage: page,
		perPage: perPage,
		totalPage: calculateTotalPage(totalData, perPage),
		totalData: totalData,
	};

	return { regions, meta };
};

/**
 * Get one region by ID.
 *
 * @param {number} id - region ID
 * @returns {Promise<Region>} - region data or null if not found
 */
const getOneProvince = async (id: number) => {

	// Get region
	const region = await db.region.findUnique({
		where: {
			id,
			type: regionEnum.PROVINCE,
			deletedAt: null,
		},
		select: {
			id: true,
			name: true,
			type: true,
			provinceId: true,
			cityId: true,
			districtId: true,
			createdAt: true,
			updatedAt: true,
		},
	});

	return region;
}

/**
 * Checks if a region exists by ID.
 *
 * @param {number} id - region ID
 * @returns {Promise<boolean>} - true if the region exists, false otherwise
 */
const isExists = async (id: number): Promise<boolean> => {

	// Check if region exists
	const region = await db.region.findUnique({
		where: {
			id,
			deletedAt: null,
		},
		select: {
			id: true
		}
	});

	return isNotEmpty(region);
};

// Export
const regionService = {
	listProvince,
	getOneProvince,
	listByType,
	isExists,
};

export default regionService;