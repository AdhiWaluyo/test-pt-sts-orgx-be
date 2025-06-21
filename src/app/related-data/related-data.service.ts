import regionEnum from "@/enums/region.enum";
import db from "@/utils/db.server";
import { calculatePagination, calculateTotalPage } from "@/utils/helper";

const listRoles = async (params: any) => {
	const { page, perPage, offset } = calculatePagination(params.page, params.perPage);

	const where = {
		deletedAt: null,
		...(params.searchKeyword && {
			name: {
				contains: params.searchKeyword,
				mode: 'insensitive',
			}
		}),
	};

	const [roles, totalData] = await Promise.all([
		db.role.findMany({
			where,
			take: perPage,
			skip: offset,
			select: {
				id: true,
				name: true,
			},
		}),
		db.role.count({ where }),
	]);

	const meta = {
		currentPage: page,
		perPage: perPage,
		totalPage: calculateTotalPage(totalData, perPage),
		totalData: totalData,
	};

	return { roles, meta };
};

/**
 * Handles list of region provinces request.
 *
 * Responds with 200 Ok and region data.
 *
 * @param {Object} params - pagination parameters
 * @param {number} [params.page=1] - current page
 * @param {number} [params.perPage=15] - number of data per page
 * @param {string} [params.searchKeyword] - search keyword
 * @returns {Promise<{ regions: Region[], meta: { currentPage: number, perPage: number, totalPage: number, totalData: number } }>}
 */
const listRegionProvinces = async (params: any) => {
	// Calculate pagination
	const { page, perPage, offset } = calculatePagination(params.page, params.perPage);

	const where = {
		type: regionEnum.PROVINCE,
		deletedAt: null,
		...(params.searchKeyword && {
			name: {
				contains: params.searchKeyword,
				mode: 'insensitive',
			}
		}),
	};

	// Get regions and total data
	const [regions, totalData] = await Promise.all([
		db.region.findMany({
			where,
			take: perPage,
			skip: offset,
			orderBy: {
				name: 'asc',
			},
			select: {
				id: true,
				name: true,
				type: true,
			}
		}),
		db.region.count({
			where
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

const listRegionByType = async (
	type: number,
	params: any,
	filter: Record<string, number> = {}
) => {
	const { page, perPage, offset } = calculatePagination(params.page, params.perPage);
	const where = {
		type,
		deletedAt: null,
		...filter,
		...(params.searchKeyword && {
			name: {
				contains: params.searchKeyword,
				mode: 'insensitive',
			}
		}),
	};

	const [regions, totalData] = await Promise.all([
		db.region.findMany({
			where,
			take: perPage,
			skip: offset,
			select: {
				id: true,
				name: true,
				type: true,
				provinceId: true,
				cityId: true,
				districtId: true,
			}
		}),
		db.region.count({
			where,
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


const reletedDataService = {
	listRoles,
	listRegionProvinces,
	listRegionByType
};

export default reletedDataService;