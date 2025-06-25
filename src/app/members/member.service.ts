import db from "@/utils/db.server";
import { calculatePagination, calculateTotalPage, isNotEmpty } from "@/utils/helper";
import { MemberInput } from "./member.type";
import { CurrentUser } from "general.type";
import { regionEnum } from "@/enums/region.enum";
import { roleEnum } from "@/enums/role.enum";

const list = async (userId: number, params: any) => {
	const { page, perPage, offset } = calculatePagination(params.page, params.perPage);

	const user = await db.user.findUnique({
		where: { id: userId },
		select: {
			roleId: true,
			provinceId: true,
			cityId: true,
			districtId: true,
			villageId: true,
		},
	});

	if (!user) {
		throw new Error("User not found");
	}

	// Default region values
	let field: "provinceId" | "cityId" | "districtId" | "villageId" = "provinceId";
	let userRegionId: number | undefined = undefined;
	let regionType: number = regionEnum.PROVINCE;

	// Tentukan region
	if (user.districtId) {
		field = "districtId";
		userRegionId = user.districtId;
		regionType = regionEnum.DISTRICT;
	} else if (user.cityId) {
		field = "cityId";
		userRegionId = user.cityId;
		regionType = regionEnum.CITY;
	} else if (user.provinceId) {
		field = "provinceId";
		userRegionId = user.provinceId;
		regionType = regionEnum.PROVINCE;
	} else if (user.villageId) {
		field = "villageId";
		userRegionId = user.villageId;
		regionType = regionEnum.VILLAGE;
	}

	// Jika bukan admin dan region user tidak ada, throw error
	if (user.roleId !== roleEnum.CENTRAL_ADMIN && userRegionId === undefined) {
		throw new Error("User region not found for non-admin user");
	}

	// Build where condition
	const whereCondition: any = {
		deletedAt: null,
		...(user.roleId !== roleEnum.CENTRAL_ADMIN ? { [field]: userRegionId } : {}),
	};

	const [members, totalData] = await Promise.all([
		db.member.findMany({
			where: whereCondition,
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
				province: { select: { id: true, name: true } },
				city: { select: { id: true, name: true } },
				district: { select: { id: true, name: true } },
				village: { select: { id: true, name: true } },
			},
		}),
		db.member.count({
			where: whereCondition,
		}),
	]);

	const meta = {
		currentPage: page,
		perPage: perPage,
		totalPage: calculateTotalPage(totalData, perPage),
		totalData: totalData,
	};

	return { members, meta };
}


const getOne = async (id: number) => {
	const member = await db.member.findFirst({
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
			},
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
	await db.member.updateMany({
		where: {
			id,
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
		},
		data: {
			deletedAt: new Date(),
		},
	});
};

const isExists = async (id: number): Promise<boolean> => {
	const member = await db.member.findFirst({
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