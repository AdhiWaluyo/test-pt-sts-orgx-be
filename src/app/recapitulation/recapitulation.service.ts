import regionEnum from "@/enums/region.enum";
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
		no: i + 1,
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


const recapitulationService = {
	getWilayahSummaryByUser
};

export default recapitulationService;