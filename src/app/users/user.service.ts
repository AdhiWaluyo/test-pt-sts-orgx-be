import bcrypt from 'bcrypt';
import db from "@/utils/db.server";
import { calculatePagination, calculateTotalPage, getFullRoleName, isNotEmpty } from "@/utils/helper";
import { CreateUserInput, UpdateUserInput } from "./user.type";
import { CurrentUser } from 'general.type';

/**
 * Handles user list request.
 *
 * Responds with 200 Ok and user list data.
 *
 * @param {Object} params - pagination parameters
 * @param {number} [params.page=1] - current page
 * @param {number} [params.perPage=15] - number of data per page
 * @returns {Promise<{ users: User[], meta: { currentPage: number, perPage: number, totalPage: number, totalData: number } }>}
 */
const list = async (params: any) => {
	const { page, perPage, offset } = calculatePagination(params.page, params.perPage);

	const [users, totalData] = await Promise.all([
		db.user.findMany({
			where: {
				deletedAt: null,
			},
			take: perPage,
			skip: offset,
			select: {
				id: true,
				username: true,
				roleId: true,
				provinceId: true,
				cityId: true,
				districtId: true,
				villageId: true,
				createdAt: true,
				updatedAt: true,
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
					}
				}
			}
		}),
		db.user.count(),
	]);

	const usersWithRoleName = users.map((user) => {
		return {
			...user,
			roleName: getFullRoleName(user)
		};
	});

	const meta = {
		currentPage: page,
		perPage: perPage,
		totalPage: calculateTotalPage(totalData, perPage),
		totalData: totalData,
	};

	return { users: usersWithRoleName, meta };
};


/**
 * Get one user by ID.
 *
 * @param {number} id - user ID
 * @returns {Promise<User>} - user data or null if not found
 */
const getOne = async (id: number) => {

	// Get user
	const user = await db.user.findUnique({
		where: {
			id,
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
			createdAt: true,
			updatedAt: true,
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
				}
			}
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

/**
 * Creates a new user in the database.
 *
 * Hashes the provided password and stores the user data, including roles.
 * Optionally associates the creation with the current user.
 *
 * @param {CreateUserInput} data - The user data to be created, including roles.
 * @param {CurrentUser} [currentUser] - The user performing the creation, optional.
 * @returns {Promise<User>} - The newly created user data.
 */
const create = async (data: CreateUserInput, currentUser?: CurrentUser) => {
	// Hash password
	const hashedPassword = await bcrypt.hash(data.password, 12);

	// Create user
	const user = await db.user.create({
		data: {
			username: data.username,
			password: hashedPassword,
			roleId: data.roleId,
			provinceId: data.provinceId,
			cityId: data.cityId,
			districtId: data.districtId,
			villageId: data.villageId,
			createdById: currentUser?.id,
		},
	});

	return getOne(user.id);
}

// Update user
const update = async (id: number, data: UpdateUserInput) => {

	// Update user
	await db.user.update({
		where: {
			id,
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

	return getOne(id);
}

/**
 * Soft deletes a user by ID.
 *
 * @param {number} id - user ID
 */
const remove = async (id: number) => {

	// Soft delete user
	await db.user.update({
		where: {
			id,
			deletedAt: null,
		},
		data: {
			deletedAt: new Date(),
		},
	});
};

/**
 * Checks if a user exists by ID.
 *
 * @param {number} id - user ID
 * @returns {Promise<boolean>} - true if the user exists, false otherwise
 */
const isExists = async (id: number): Promise<boolean> => {

	// Check if user exists
	const user = await db.user.findUnique({
		where: {
			id,
			deletedAt: null,
		},
		select: {
			id: true
		}
	});

	return isNotEmpty(user);
};

// Export
const userService = {
	list,
	getOne,
	create,
	update,
	remove,
	isExists,
};

export default userService;