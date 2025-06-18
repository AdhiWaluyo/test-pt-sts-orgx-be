import db from "@/utils/db.server";
import { calculatePagination, calculateTotalPage, isNotEmpty } from "@/utils/helper";
import { MemberInput } from "./member.type";
import { CurrentUser } from "general.type";

const list = async (params: any) => {
	const { page, perPage, offset } = calculatePagination(params.page, params.perPage);

	const [members, totalData] = await Promise.all([
		db.member.findMany({
			where: {
				deletedAt: null,
			},
			take: perPage,
			skip: offset,
			select: {
				id: true,
				name: true,
				nik: true,
				phone: true,
				provinceId: true,
				cityId: true,
				districtId: true,
				villageId: true,
				createdAt: true,
				updatedAt: true,
			}
		}),
		db.member.count(),
	]);

	const meta = {
		currentPage: page,
		perPage: perPage,
		totalPage: calculateTotalPage(totalData, perPage),
		totalData: totalData,
	}

	return { members, meta };
}

const getOne = async (id: number) => {
	const member = await db.member.findUnique({
		where: {
			id,
			deletedAt: null,
		},
		select: {
			id: true,
			name: true,
			nik: true,
			phone: true,
			provinceId: true,
			cityId: true,
			districtId: true,
			villageId: true,
			createdAt: true,
			updatedAt: true,
		},
	});

	return member;
}

const create = async (data: MemberInput, currentUser?: CurrentUser) => {
	const member = await db.member.create({
		data: {
			name: data.name,
			nik: data.nik,
			phone: data.phone,
			provinceId: data.provinceId,
			cityId: data.cityId,
			districtId: data.districtId,
			villageId: data.villageId,
		},
	});

	return getOne(member.id);
}

const update = async (id: number, data: MemberInput) => {
	db.member.update({
		where: {
			id,
			deletedAt: null,
		},
		data: {
			name: data.name,
			nik: data.nik,
			phone: data.phone,
			provinceId: data.provinceId,
			cityId: data.cityId,
			districtId: data.districtId,
			villageId: data.villageId,
		},
	})

	return getOne(id);
}

const remove = async (id: number) => {
	await db.member.update({
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
	const member = await db.member.findUnique({
		where: {
			id,
			deletedAt: null,
		},
		select: {
			id: true
		}
	});

	return isNotEmpty(member);
};

const memberService = {
	list,
	getOne,
	create,
	update,
	remove,
	isExists,
};

export default memberService;