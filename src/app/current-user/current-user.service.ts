import db from "@/utils/db.server";
import { UpdateProfileInput } from "./current-user.type";

const profile = async (userId: number) => {
	const user = await db.user.findUnique({
		where: {
			id: userId,
			deletedAt: null,
		},
		select: {
			id: true,
			name: true,
			email: true,
			phoneNumber: true,
			createdAt: true,
			updatedAt: true,
		},
	});

	return user;
}

const updateProfile = async (userId: number, data: UpdateProfileInput) => {
	await db.user.update({
		where: {
			id: userId,
			deletedAt: null,
		},
		data: {
			name: data.name,
			phoneNumber: data.phoneNumber || null,
		},
	});

	return profile(userId);
}

const accessRights = async (userId?: number) => {
	const permissions = await db.permission.findMany({
		where: {
			deletedAt: null,
			roleHasPermissions: {
				some: {
					role: {
						deletedAt: null,
						userHasRoles: {
							some: {
								userId: userId
							}
						}
					}
				}
			}
		},
		select: {
			id: true
		}
	});

	return permissions.map(p => p.id);
}

async function getUserRoleIds(userId: number): Promise<number[]> {
	const userRoles = await db.userHasRole.findMany({
		where: { userId },
		select: {
			roleId: true,
		},
	});

	return userRoles.map(ur => ur.roleId);
}


const currentUserService = {
	profile,
	updateProfile,
	accessRights,
	getUserRoleIds
}

export default currentUserService;