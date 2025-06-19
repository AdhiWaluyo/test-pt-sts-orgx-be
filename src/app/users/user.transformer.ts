export const transformUser = (user: any) => {

	return {
		id: user.id,
		username: user.username,
		roleId: user.roleId,
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
		createdAt: user.createdAt,
		updatedAt: user.updatedAt,
	}
}