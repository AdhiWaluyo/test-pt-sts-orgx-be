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
	}
}