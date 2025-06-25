import bcrypt from 'bcrypt';
import db from '@/utils/db.server';
import { roleEnum } from "@/enums/role.enum";

const userSeeder = async () => {

	// Hash password
	const hashedPassword = await bcrypt.hash('password', 12);

	// Create users
	await db.user.createMany({
		data: [
			{
				username: "devAdhi93",
				password: hashedPassword,
				roleId: roleEnum.CENTRAL_ADMIN,
			},
			{
				username: "admin2",
				password: hashedPassword,
				roleId: roleEnum.PROVINCIAL_ADMIN,
				provinceId: 2
			},
			{
				username: "admin3",
				password: hashedPassword,
				roleId: roleEnum.CITY_ADMIN,
				provinceId: 2,
				cityId: 7
			},
			{
				username: "admin4",
				password: hashedPassword,
				roleId: roleEnum.DISTRICT_ADMIN,
				provinceId: 2,
				cityId: 7,
				districtId: 13
			},
			{
				username: "admin5",
				password: hashedPassword,
				roleId: roleEnum.VILLAGE_ADMIN,
				provinceId: 2,
				cityId: 7,
				districtId: 13,
				villageId: 27
			},
			{
				username: "admin6",
				password: hashedPassword,
				roleId: roleEnum.PROVINCIAL_ADMIN,
				provinceId: 3
			},
			{
				username: "admin7",
				password: hashedPassword,
				roleId: roleEnum.CITY_ADMIN,
				provinceId: 3,
				cityId: 8
			},
			{
				username: "admin8",
				password: hashedPassword,
				roleId: roleEnum.DISTRICT_ADMIN,
				provinceId: 3,
				cityId: 8,
				districtId: 16
			},
			{
				username: "admin9",
				password: hashedPassword,
				roleId: roleEnum.VILLAGE_ADMIN,
				provinceId: 3,
				cityId: 8,
				districtId: 15,
				villageId: 33
			},
		],
	});
}

export default userSeeder;