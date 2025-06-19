import regionEnum from "@/enums/region.enum";
import db from "@/utils/db.server";
import { subMinutes } from "@/utils/helper";

const getSummary = async (userId: number) => {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	// Get user
	const user = await db.user.findUnique({
		where: {
			id: userId,
			deletedAt: null,
		},
		select: {
			id: true,
			roleId: true,
			Region: {
				select: {
					id: true,
					type: true
				}
			}
		},
	});

	// If user has no region
	if (!user?.Region) {
		const [totalAll, totalToday] = await Promise.all([
			db.member.count({ where: { deletedAt: null } }),
			db.member.count({ where: { deletedAt: null, createdAt: { gte: today } } }),
		]);
		return { totalAll, totalToday };
	}

	// If user has region
	const regionFieldMap: Record<string, keyof typeof db.member.fields> = {
		[regionEnum.PROVINCE]: 'provinceId',
		[regionEnum.CITY]: 'cityId',
		[regionEnum.DISTRICT]: 'districtId',
		[regionEnum.VILLAGE]: 'villageId',
	};

	// Get region field
	const regionField = regionFieldMap[user.Region.type];

	// If region field is not found
	if (!regionField) {
		return { totalAll: 0, totalToday: 0 }
	};

	// Get region filter
	const regionFilter = { [regionField]: user.Region.id };

	const [totalAll, totalToday] = await Promise.all([
		db.member.count({
			where: {
				...regionFilter,
				deletedAt: null
			}
		}),
		db.member.count({
			where: {
				...regionFilter,
				deletedAt: null,
				createdAt: { gte: today }
			}
		}),
	]);

	return { totalAll, totalToday };
};


const getChart = async (userId: number) => {
	const start = subMinutes(new Date(), 30);

	const user = await db.user.findUnique({
		where: { id: userId, deletedAt: null },
		select: {
			Region: {
				select: {
					id: true,
					type: true,
				}
			}
		}
	});

	let regionFilter = ''; // default no filter

	if (user?.Region) {
		const regionFieldMap: Record<string, string> = {
			[regionEnum.PROVINCE]: 'province_id',
			[regionEnum.CITY]: 'city_id',
			[regionEnum.DISTRICT]: 'district_id',
			[regionEnum.VILLAGE]: 'village_id',
		};

		const regionField = regionFieldMap[user.Region.type];

		if (regionField) {
			regionFilter = `AND "${regionField}" = ${user.Region.id}`;
		}
	}

	const result = await db.$queryRawUnsafe<any[]>(`
		SELECT
			date_trunc('minute', "created_at") - make_interval(mins => EXTRACT(MINUTE FROM "created_at")::int % 5) as interval,
			COUNT(*) as total
		FROM members
		WHERE "created_at" >= $1 AND "deleted_at" IS NULL
		${regionFilter}
		GROUP BY interval
		ORDER BY interval ASC
	`, start);

	return result.map(r => ({
		time: r.interval,
		total: Number(r.total)
	}));
};


const dashboardService = {
	getSummary,
	getChart
};

export default dashboardService;