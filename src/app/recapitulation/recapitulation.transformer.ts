export const transformRecapitulation = (recapitulation: any) => {
	return {
		id: recapitulation.id,
		name: recapitulation.name,
		nik: recapitulation.nik,
		phone: recapitulation.phone,
		province: recapitulation.province
			? { id: recapitulation.province.id, name: recapitulation.province.name }
			: null,
		city: recapitulation.city
			? { id: recapitulation.city.id, name: recapitulation.city.name }
			: null,
		district: recapitulation.district
			? { id: recapitulation.district.id, name: recapitulation.district.name }
			: null,
		village: recapitulation.village
			? { id: recapitulation.village.id, name: recapitulation.village.name }
			: null,
		createdAt: recapitulation.createdAt,
		updatedAt: recapitulation.updatedAt,
	};
};
