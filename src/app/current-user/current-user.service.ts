import db from "@/utils/db.server";
import { UpdateProfileInput } from "./current-user.type";
import { getFullRoleName } from "@/utils/helper";

const profile = async (userId: number) => {
	const user = await db.user.findUnique({
		where: {
			id: userId,
			deletedAt: null,
		},
		select: {
			id: true,
			username: true,
			roleId: true,
			provinceId: true,
			cityId: true,
			districtId: true,
			villageId: true,
			role: {
				select: {
					id: true,
					name: true,
				}
			},
			province: {
				select: {
					id: true,
					name: true,
				}
			},
			city: {
				select: {
					id: true,
					name: true,
				}
			},
			district: {
				select: {
					id: true,
					name: true,
				}
			},
			village: {
				select: {
					id: true,
					name: true,
				},
			},
			createdAt: true,
			updatedAt: true,
		},
	});

	if (!user) {
		throw new Error('User not found');
	}

	return {
		...user,
		roleName: getFullRoleName(user),
	};
}

const updateProfile = async (userId: number, data: UpdateProfileInput) => {
	await db.user.update({
		where: {
			id: userId,
			deletedAt: null,
		},
		data: {
			roleId: data.roleId,
			provinceId: data.provinceId,
			cityId: data.cityId,
			districtId: data.districtId,
			villageId: data.villageId,
		},
	});

	return profile(userId);
}

async function getUserById(userId: number) {
	const user = await db.user.findUnique({
		where: {
			id: userId,
			deletedAt: null
		},
		select: {
			id: true,
			roleId: true,
			username: true,
		},
	});

	return user;
}


const currentUserService = {
	profile,
	updateProfile,
	getUserById
}

export default currentUserService;