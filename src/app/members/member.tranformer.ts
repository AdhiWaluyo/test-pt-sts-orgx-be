export const transformMember = (member: any) => {

	return {
		id: member.id,
		name: member.name,
		nik: member.nik,
		phone: member.phone,
		provinceId: member.provinceId,
		cityId: member.cityId,
		districtId: member.districtId,
		villageId: member.villageId,
		createdAt: member.createdAt,
		updatedAt: member.updatedAt,
		province: {
			id: member.province.id,
			name: member.province.name,
		},
		city: {
			id: member.city.id,
			name: member.city.name,
		},
		district: {
			id: member.district.id,
			name: member.district.name,
		},
		village: {
			id: member.village.id,
			name: member.village.name,
		},
	}
}