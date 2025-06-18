import db from "@/utils/db.server";
import { subMinutes } from "@/utils/helper";

const getSummary = async () => {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const [totalAll, totalToday] = await Promise.all([
		db.member.count({ where: { deletedAt: null } }),
		db.member.count({ where: { deletedAt: null, createdAt: { gte: today } } }),
	]);

	return { totalAll, totalToday };
};

const getChart = async () => {
	const start = subMinutes(new Date(), 30);

	const result = await db.$queryRawUnsafe<any[]>(`
		SELECT
			date_trunc('minute', "created_at") - make_interval(mins => EXTRACT(MINUTE FROM "created_at")::int % 5) as interval,
			COUNT(*) as total
		FROM members
		WHERE "created_at" >= $1 AND "deleted_at" IS NULL
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