export const transformUser = (user: any) => {

	// Get roles
	const roles = user?.userHasRoles?.map((userHasRole: any) => userHasRole?.role);

	return {
		id: user.id,
		name: user.name,
		email: user.email,
		phoneNumber: user.phoneNumber,
		isActive: user.isActive,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt,
		roles: roles
	}
}