import { regionEnum } from "@/enums/region.enum";
import { roleEnum } from "@/enums/role.enum";
import db from "@/utils/db.server";
import { calculatePagination, calculateTotalPage } from "@/utils/helper";

const getWilayahSummaryByUser = async (userId: number, params: any) => {
	const { page, perPage, offset } = calculatePagination(params.page, params.perPage);

	const user = await db.user.findUnique({
		where: { id: userId },
		select: {
			roleId: true,
			provinceId: true,
			cityId: true,
			districtId: true,
			villageId: true,
		},
	});

	if (!user) {
		throw new Error("User not found");
	};

	if (user.villageId) {
		const [dataVillageMembers, totalDataVillageMember] = await Promise.all([
			db.member.findMany({
				where: {
					villageId: user.villageId,
					deletedAt: null,
				},
				take: perPage,
				skip: offset,
				select: {
					name: true,
					nik: true,
					phone: true,
					province: {
						select: {
							id: true,
							name: true
						}
					},
					city: {
						select: {
							id: true,
							name: true
						}
					},
					district: {
						select: {
							id: true,
							name: true
						}
					},
					village: {
						select: {
							id: true,
							name: true
						}
					},
					createdAt: true,
				}
			}),
			db.member.count({
				where: {
					villageId: user.villageId,
					deletedAt: null,
				}
			}),
		]);

		const meta = {
			currentPage: page,
			perPage,
			totalPage: calculateTotalPage(totalDataVillageMember, perPage),
			totalData: totalDataVillageMember,
		};

		return { data: dataVillageMembers, meta };
	}

	let field: "provinceId" | "cityId" | "districtId" = "provinceId";
	let userRegionId: number | undefined = undefined;
	let regionType: number = regionEnum.PROVINCE;

	if (user.districtId) {
		field = "districtId";
		userRegionId = user.districtId;
		regionType = regionEnum.DISTRICT;
	} else if (user.cityId) {
		field = "cityId";
		userRegionId = user.cityId;
		regionType = regionEnum.CITY;
	} else if (user.provinceId) {
		field = "provinceId";
		userRegionId = user.provinceId;
		regionType = regionEnum.PROVINCE;
	}

	// Get data group by wilayah
	const result = await db.member.groupBy({
		by: [field],
		where: {
			deletedAt: null,
			...(userRegionId ? { [field]: userRegionId } : {}),
		},
		_count: { _all: true }
	});

	const regionIds = result.map(r => r[field]);
	const regions = await db.region.findMany({
		where: {
			id: { in: regionIds as number[] },
			type: regionType,
			deletedAt: null,
		},
		select: { id: true, name: true }
	});

	const regionMap = Object.fromEntries(regions.map(r => [r.id, r.name]));

	const summary = result.map((row, i) => ({
		// no: i + 1,
		regionId: row[field] as number,
		regionType,
		name: regionMap[row[field] as number] ?? "-",
		total: row._count._all,
	}));


	const paginated = summary.slice(offset, offset + perPage);

	const meta = {
		currentPage: page,
		perPage,
		totalPage: calculateTotalPage(summary.length, perPage),
		totalData: summary.length,
	};

	return { data: paginated, meta };
};

const list = async (
	userId: number,
	params: any,
	regionId?: number,
	regionType?: number
) => {
	const { page, perPage, offset } = calculatePagination(params.page, params.perPage);

	const user = await db.user.findUnique({
		where: { id: userId },
		select: {
			roleId: true,
			provinceId: true,
			cityId: true,
			districtId: true,
			villageId: true,
		},
	});

	if (!user) {
		throw new Error("User not found");
	}

	// Default field & region info
	let field: "provinceId" | "cityId" | "districtId" | "villageId" = "provinceId";
	let userRegionId: number | undefined;
	let effectiveRegionType: number = regionEnum.PROVINCE;

	if (user.roleId === roleEnum.CENTRAL_ADMIN) {
		// Kalau admin, cek param regionType & regionId
		if (regionType && regionId) {
			effectiveRegionType = regionType;

			if (regionType === regionEnum.PROVINCE) {
				field = "provinceId";
			} else if (regionType === regionEnum.CITY) {
				field = "cityId";
			} else if (regionType === regionEnum.DISTRICT) {
				field = "districtId";
			} else if (regionType === regionEnum.VILLAGE) {
				field = "villageId";
			}

			userRegionId = regionId;
		} else {
			// Kalau admin tapi nggak ada filter region, biarkan semua data tanpa filter region
			field = "provinceId"; // default
			userRegionId = undefined;
		}
	} else {
		// Bukan admin, pakai region dari user
		if (user.villageId) {
			field = "villageId";
			userRegionId = user.villageId;
			effectiveRegionType = regionEnum.VILLAGE;
		} else if (user.districtId) {
			field = "districtId";
			userRegionId = user.districtId;
			effectiveRegionType = regionEnum.DISTRICT;
		} else if (user.cityId) {
			field = "cityId";
			userRegionId = user.cityId;
			effectiveRegionType = regionEnum.CITY;
		} else if (user.provinceId) {
			field = "provinceId";
			userRegionId = user.provinceId;
			effectiveRegionType = regionEnum.PROVINCE;
		}

		if (userRegionId === undefined) {
			throw new Error("User region not found for non-admin user");
		}
	}

	// Build where condition
	const whereCondition: any = {
		deletedAt: null,
		...(userRegionId !== undefined ? { [field]: userRegionId } : {}),
	};

	const [members, totalData] = await Promise.all([
		db.member.findMany({
			where: whereCondition,
			take: perPage,
			skip: offset,
			select: {
				id: true,
				name: true,
				nik: true,
				phone: true,
				provinceId: true,
				cityId: true,
				districtId: true,
				villageId: true,
				createdAt: true,
				updatedAt: true,
				province: { select: { id: true, name: true } },
				city: { select: { id: true, name: true } },
				district: { select: { id: true, name: true } },
				village: { select: { id: true, name: true } },
			},
		}),
		db.member.count({
			where: whereCondition,
		}),
	]);

	const meta = {
		currentPage: page,
		perPage,
		totalPage: calculateTotalPage(totalData, perPage),
		totalData,
	};

	return { members, meta };
};


const recapitulationService = {
	getWilayahSummaryByUser,
	list
};

export default recapitulationService;