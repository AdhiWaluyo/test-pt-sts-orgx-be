export const transformCurrentUser = (user: any) => {

	return {
		id: user.id,
		username: user.username,
		roleId: user.roleId,
		provinceId: user.provinceId,
		cityId: user.cityId,
		districtId: user.districtId,
		villageId: user.villageId,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt,
		roleName: user.roleName,
		role: user.role ?
			{
				id: user.role.id,
				name: user.role.name
			} : null,
		province: user.province ?
			{
				id: user.province.id,
				name: user.province.name
			} : null,
		city: user.city ?
			{
				id: user.city.id,
				name: user.city.name
			} : null,
		district: user.district ?
			{
				id: user.district.id,
				name: user.district.name
			} : null,
		village: user.village ?
			{
				id: user.village.id,
				name: user.village.name
			} : null,
	}
}