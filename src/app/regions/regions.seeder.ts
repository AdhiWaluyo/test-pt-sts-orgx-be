import db from "@/utils/db.server";
import regionEnum from '@/enums/region.enum';

const regionSeeder = async () => {
	// --- Province ---
	const dki = await db.region.create({ data: { name: 'DKI Jakarta', type: regionEnum.PROVINCE } });
	const jabar = await db.region.create({ data: { name: 'Jawa Barat', type: regionEnum.PROVINCE } });
	const jateng = await db.region.create({ data: { name: 'Jawa Tengah', type: regionEnum.PROVINCE } });
	const diy = await db.region.create({ data: { name: 'DI Yogyakarta', type: regionEnum.PROVINCE } });
	const jatim = await db.region.create({ data: { name: 'Jawa Timur', type: regionEnum.PROVINCE } });

	// --- City ---
	const kotaJakTim = await db.region.create({ data: { name: 'Jakarta Timur', type: regionEnum.CITY, provinceId: dki.id } });
	const kabBandung = await db.region.create({ data: { name: 'Bandung', type: regionEnum.CITY, provinceId: jabar.id } });
	const kotaSemarang = await db.region.create({ data: { name: 'Semarang', type: regionEnum.CITY, provinceId: jateng.id } });
	const kabSleman = await db.region.create({ data: { name: 'Sleman', type: regionEnum.CITY, provinceId: diy.id } });
	const kotaSurabaya = await db.region.create({ data: { name: 'Surabaya', type: regionEnum.CITY, provinceId: jatim.id } });

	// --- District ---
	const kecJatinegara = await db.region.create({ data: { name: 'Jatinegara', type: regionEnum.DISTRICT, provinceId: dki.id, cityId: kotaJakTim.id } });
	const kecCoblong = await db.region.create({ data: { name: 'Coblong', type: regionEnum.DISTRICT, provinceId: jabar.id, cityId: kabBandung.id } });
	const kecBanyumanik = await db.region.create({ data: { name: 'Banyumanik', type: regionEnum.DISTRICT, provinceId: jateng.id, cityId: kotaSemarang.id } });
	const kecDepok = await db.region.create({ data: { name: 'Depok', type: regionEnum.DISTRICT, provinceId: diy.id, cityId: kabSleman.id } });
	const kecTegalsari = await db.region.create({ data: { name: 'Tegalsari', type: regionEnum.DISTRICT, provinceId: jatim.id, cityId: kotaSurabaya.id } });

	// --- Village ---
	const districtData = [
		// Jatinegara
		['Bidaracina', dki.id, kotaJakTim.id, kecJatinegara.id],
		['Rawa Bunga', dki.id, kotaJakTim.id, kecJatinegara.id],
		['Cipinang Cempedak', dki.id, kotaJakTim.id, kecJatinegara.id],
		['Bali Mester', dki.id, kotaJakTim.id, kecJatinegara.id],
		['Cipinang Besar Selatan', dki.id, kotaJakTim.id, kecJatinegara.id],

		// Coblong
		['Dago', jabar.id, kabBandung.id, kecCoblong.id],
		['Lebak Gede', jabar.id, kabBandung.id, kecCoblong.id],
		['Sekeloa', jabar.id, kabBandung.id, kecCoblong.id],
		['Ciumbuleuit', jabar.id, kabBandung.id, kecCoblong.id],
		['Sadia', jabar.id, kabBandung.id, kecCoblong.id],

		// Banyumanik
		['Padangsari', jateng.id, kotaSemarang.id, kecBanyumanik.id],
		['Ngesrep', jateng.id, kotaSemarang.id, kecBanyumanik.id],
		['Banyumanik', jateng.id, kotaSemarang.id, kecBanyumanik.id],
		['Pedalangan', jateng.id, kotaSemarang.id, kecBanyumanik.id],
		['Srondol Wetan', jateng.id, kotaSemarang.id, kecBanyumanik.id],

		// Depok
		['Caturtunggal', diy.id, kabSleman.id, kecDepok.id],
		['Condongcatur', diy.id, kabSleman.id, kecDepok.id],
		['Maguwoharjo', diy.id, kabSleman.id, kecDepok.id],
		['Sinduadi', diy.id, kabSleman.id, kecDepok.id],
		['Gejayan', diy.id, kabSleman.id, kecDepok.id],
		// Tegalsari
		['Dr. Soetomo', jatim.id, kotaSurabaya.id, kecTegalsari.id],
		['Kedungdoro', jatim.id, kotaSurabaya.id, kecTegalsari.id],
		['Wonorejo', jatim.id, kotaSurabaya.id, kecTegalsari.id],
		['Tegalsari', jatim.id, kotaSurabaya.id, kecTegalsari.id],
		['Keputran', jatim.id, kotaSurabaya.id, kecTegalsari.id],
	];

	await db.region.createMany({
		data: districtData.map(([name, provId, citId, disId]) => ({
			name: name as string,
			type: regionEnum.VILLAGE,
			provinceId: provId as number,
			cityId: citId as number,
			districtId: disId as number
		}))
	});
}

export default regionSeeder;