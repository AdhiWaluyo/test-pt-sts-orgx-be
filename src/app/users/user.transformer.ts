export const transformUser = (user: any) => {

	return {
		id: user.id,
		username: user.username,
		roleId: user.roleId,
		regionId: user.regionId,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt,
	}
}