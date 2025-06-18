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
			username: true,
			roleId: true,
			regionId: true,
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
			roleId: data.roleId,
			regionId: data.regionId
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