import { regionEnum } from "@/enums/region.enum";
import db from "@/utils/db.server";
import { faker } from "@faker-js/faker";

const memberSeeder = async () => {
	const now = new Date();
	const data = [];

	for (let i = 0; i < 50; i++) {
		const districtId = faker.number.int({ min: 11, max: 20 });

		const village = await db.region.findFirst({
			where: {
				districtId,
				type: regionEnum.VILLAGE,
				deletedAt: null,
			},
			select: {
				id: true,
				provinceId: true,
				cityId: true,
				districtId: true,
			},
		});

		if (!village) {
			continue;
		}

		const createdAt = new Date(now.getTime() - i * 5 * 60 * 1000);

		data.push({
			nik: faker.string.numeric(16),
			name: faker.internet.username(),
			phone: "+62" + faker.string.numeric(11),
			provinceId: village.provinceId ?? undefined,
			cityId: village.cityId ?? undefined,
			districtId: village.districtId ?? undefined,
			villageId: village.id,
			createdAt,
			updatedAt: createdAt,
		});
	}

	if (data.length > 0) {
		await db.member.createMany({
			data,
		});
		console.log(`Inserted ${data.length} members.`);
	} else {
		console.log("No villages found in the selected districts.");
	}
};

export default memberSeeder;
