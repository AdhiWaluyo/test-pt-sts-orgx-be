import db from "@/utils/db.server";
import { regionEnum } from "@/enums/region.enum";

const regionSeeder = async () => {
	// --- Province ---
	const dki = await db.region.create({
		data: { name: "DKI Jakarta", type: regionEnum.PROVINCE },
	});
	const jabar = await db.region.create({
		data: { name: "Jawa Barat", type: regionEnum.PROVINCE },
	});
	const jateng = await db.region.create({
		data: { name: "Jawa Tengah", type: regionEnum.PROVINCE },
	});
	const diy = await db.region.create({
		data: { name: "DI Yogyakarta", type: regionEnum.PROVINCE },
	});
	const jatim = await db.region.create({
		data: { name: "Jawa Timur", type: regionEnum.PROVINCE },
	});

	// --- City & District ---
	const citiesAndDistricts = [
		{
			city: await db.region.create({
				data: { name: "Jakarta Timur", type: regionEnum.CITY, provinceId: dki.id },
			}),
			districts: ["Jatinegara", "Cakung"],
		},
		{
			city: await db.region.create({
				data: { name: "Bandung", type: regionEnum.CITY, provinceId: jabar.id },
			}),
			districts: ["Coblong", "Cidadap"],
		},
		{
			city: await db.region.create({
				data: { name: "Semarang", type: regionEnum.CITY, provinceId: jateng.id },
			}),
			districts: ["Banyumanik", "Candisari"],
		},
		{
			city: await db.region.create({
				data: { name: "Sleman", type: regionEnum.CITY, provinceId: diy.id },
			}),
			districts: ["Depok", "Godean"],
		},
		{
			city: await db.region.create({
				data: { name: "Surabaya", type: regionEnum.CITY, provinceId: jatim.id },
			}),
			districts: ["Tegalsari", "Wonokromo"],
		},
	];

	const villages: any[] = [];

	for (const { city, districts } of citiesAndDistricts) {
		for (const districtName of districts) {
			const district = await db.region.create({
				data: {
					name: districtName,
					type: regionEnum.DISTRICT,
					provinceId: city.provinceId,
					cityId: city.id,
				},
			});

			for (let i = 1; i <= 3; i++) {
				villages.push({
					name: `${districtName} Village ${i}`,
					type: regionEnum.VILLAGE,
					provinceId: city.provinceId,
					cityId: city.id,
					districtId: district.id,
				});
			}
		}
	}

	// --- Village ---
	await db.region.createMany({ data: villages });
};

export default regionSeeder;
