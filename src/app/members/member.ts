export const transformRole = (role: any) => {

	return {
		id: role.id,
		name: role.name,
		description: role.description,
		accessLevel: role.accessLevel,
		createdAt: role.createdAt,
		updatedAt: role.updatedAt,
	}
}