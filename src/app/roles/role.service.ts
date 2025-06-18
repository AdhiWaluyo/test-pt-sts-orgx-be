import db from "@/utils/db.server";
import { calculatePagination, calculateTotalPage, isNotEmpty } from "@/utils/helper";
import { RoleInput } from "./role.type";
import { CurrentUser } from "general.type";

const list = async (params: any) => {
	const { page, perPage, offset } = calculatePagination(params.page, params.perPage);

	const [roles, totalData] = await Promise.all([
		db.role.findMany({
			where: {
				deletedAt: null,
			},
			take: perPage,
			skip: offset,
			select: {
				id: true,
				name: true,
				description: true,
				accessLevel: true,
				createdAt: true,
				updatedAt: true,
			}
		}),
		db.role.count(),
	]);

	const meta = {
		currentPage: page,
		perPage: perPage,
		totalPage: calculateTotalPage(totalData, perPage),
		totalData: totalData,
	}

	return { roles, meta };
}

const getOne = async (id: number) => {
	const role = await db.role.findUnique({
		where: {
			id,
			deletedAt: null,
		},
		select: {
			id: true,
			name: true,
			description: true,
			createdAt: true,
			updatedAt: true,
		},
	});

	return role;
}

const create = async (data: RoleInput, currentUser?: CurrentUser) => {
	const role = await db.role.create({
		data: {
			name: data.name,
			description: data.description || null,
			accessLevel: data.accessLevel,
			createdById: currentUser?.id,
		},
	});

	return getOne(role.id);
}

const update = async (id: number, data: RoleInput) => {
	db.role.update({
		where: {
			id,
			deletedAt: null,
		},
		data: {
			name: data.name,
			description: data.description || null,
			accessLevel: data.accessLevel,
		},
	})

	return getOne(id);
}

const remove = async (id: number) => {
	await db.role.update({
		where: {
			id,
			deletedAt: null,
		},
		data: {
			deletedAt: new Date(),
		},
	});
};

const isExists = async (id: number): Promise<boolean> => {
	const role = await db.role.findUnique({
		where: {
			id,
			deletedAt: null,
		},
		select: {
			id: true
		}
	});

	return isNotEmpty(role);
};

const roleService = {
	list,
	getOne,
	create,
	update,
	remove,
	isExists,
};

export default roleService;