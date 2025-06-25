import { regionEnum } from "@/enums/region.enum";
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

const getRegionByIdAndType = async (id: number, type: number) => {
	const region = await db.region.findFirst({
		where: {
			id,
			type
		},
		select: {
			id: true,
			name: true,
			type: true,
			provinceId: true,
			cityId: true,
			districtId: true,
		}
	});

	return region;
};

// const getRegionTree = async (id: number, type: number) => {
// 	// Get parent region
// 	const parent = await db.region.findFirst({
// 		where: { id, type, deletedAt: null },
// 		select: {
// 			id: true,
// 			name: true,
// 			type: true,
// 		},
// 	});

// 	if (!parent) {
// 		throw new Error("Region not found");
// 	}

// 	// Get children with recursive
// 	const buildChildren = async (parentId: number, parentType: number): Promise<any[]> => {
// 		let childType: number | undefined;
// 		let where: any = { deletedAt: null };

// 		if (parentType === regionEnum.PROVINCE) {
// 			childType = regionEnum.CITY;
// 			where = { provinceId: parentId, type: childType, deletedAt: null };
// 		} else if (parentType === regionEnum.CITY) {
// 			childType = regionEnum.DISTRICT;
// 			where = { cityId: parentId, type: childType, deletedAt: null };
// 		} else if (parentType === regionEnum.DISTRICT) {
// 			childType = regionEnum.VILLAGE;
// 			where = { districtId: parentId, type: childType, deletedAt: null };
// 		} else {
// 			// village tidak ada children
// 			return [];
// 		}

// 		const children = await db.region.findMany({
// 			where,
// 			select: {
// 				id: true,
// 				name: true,
// 				type: true,
// 			},
// 		});

// 		// Untuk setiap child, ambil lagi children-nya
// 		const withChildren = await Promise.all(
// 			children.map(async (child) => ({
// 				...child,
// 				children: await buildChildren(child.id, child.type),
// 			}))
// 		);

// 		return withChildren;
// 	};

// 	const result = {
// 		id: parent.id,
// 		name: parent.name,
// 		type: parent.type,
// 		children: await buildChildren(parent.id, parent.type),
// 	};

// 	return result;
// };

const getRegionWithDirectChildren = async (id: number, type: number) => {
	// Get parent region
	const parent = await db.region.findFirst({
		where: { id, type, deletedAt: null },
		select: {
			id: true,
			name: true,
			type: true,
		},
	});

	if (!parent) {
		throw new Error("Region not found");
	}

	let childType: number | undefined;
	let where: any = { deletedAt: null };

	if (type === regionEnum.PROVINCE) {
		childType = regionEnum.CITY;
		where = { provinceId: id, type: childType, deletedAt: null };
	} else if (type === regionEnum.CITY) {
		childType = regionEnum.DISTRICT;
		where = { cityId: id, type: childType, deletedAt: null };
	} else if (type === regionEnum.DISTRICT) {
		childType = regionEnum.VILLAGE;
		where = { districtId: id, type: childType, deletedAt: null };
	} else {
		// Village does not have children
		childType = undefined;
	}

	let children: any[] | null = null;

	if (childType) {
		children = await db.region.findMany({
			where,
			select: {
				id: true,
				name: true,
				type: true,
			},
		});
	}

	return {
		id: parent.id,
		name: parent.name,
		type: parent.type,
		children: children && children.length > 0 ? children : null,
	};
};


const relatedDataService = {
	listRoles,
	listRegionProvinces,
	listRegionByType,
	getRegionByIdAndType,
	getRegionWithDirectChildren
};

export default relatedDataService;