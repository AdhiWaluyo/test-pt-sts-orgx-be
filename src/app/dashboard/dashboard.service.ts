import db from "@/utils/db.server";
import { subMinutes } from "@/utils/helper";

const getSummary = async (userId: number) => {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const user = await db.user.findFirst({
		where: {
			id: userId,
			deletedAt: null
		},
		select: {
			id: true,
			roleId: true,
			provinceId: true,
			cityId: true,
			districtId: true,
			villageId: true
		}
	});

	// Determine the deepest level of region filter
	let filterField: string | null = null;
	let filterValue: number | null = null;

	if (user?.villageId) {
		filterField = 'villageId';
		filterValue = user.villageId;
	} else if (user?.districtId) {
		filterField = 'districtId';
		filterValue = user.districtId;
	} else if (user?.cityId) {
		filterField = 'cityId';
		filterValue = user.cityId;
	} else if (user?.provinceId) {
		filterField = 'provinceId';
		filterValue = user.provinceId;
	}

	// If no region restriction (e.g., super admin)
	if (!filterField || !filterValue) {
		const [totalAll, totalToday] = await Promise.all([
			db.member.count({ where: { deletedAt: null } }),
			db.member.count({
				where: { deletedAt: null, createdAt: { gte: today } }
			}),
		]);
		return { totalAll, totalToday };
	}

	const regionFilter = { [filterField]: filterValue };

	const [totalAll, totalToday] = await Promise.all([
		db.member.count({
			where: { ...regionFilter, deletedAt: null }
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

	const user = await db.user.findFirst({
		where: {
			id: userId,
			deletedAt: null
		},
		select: {
			provinceId: true,
			cityId: true,
			districtId: true,
			villageId: true
		}
	});

	let regionClause = ''; // default: tidak ada filter
	if (user) {
		if (user.villageId) {
			regionClause = `AND "village_id" = ${user.villageId}`;
		} else if (user.districtId) {
			regionClause = `AND "district_id" = ${user.districtId}`;
		} else if (user.cityId) {
			regionClause = `AND "city_id" = ${user.cityId}`;
		} else if (user.provinceId) {
			regionClause = `AND "province_id" = ${user.provinceId}`;
		}
	}

	const result = await db.$queryRawUnsafe<any[]>(`
		SELECT
			date_trunc('minute', "created_at") - make_interval(mins => EXTRACT(MINUTE FROM "created_at")::int % 5) AS interval,
			COUNT(*) AS total
		FROM members
		WHERE "created_at" >= $1
		AND "deleted_at" IS NULL
		${regionClause}
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