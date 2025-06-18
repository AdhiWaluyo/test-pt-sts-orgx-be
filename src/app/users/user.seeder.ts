import bcrypt from 'bcrypt';
import db from '@/utils/db.server';
import roleEnum from '@/enums/role.enum';

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
				username: "adminJabar",
				password: hashedPassword,
				roleId: roleEnum.PROVINCIAL_ADMIN,
				regionId: 2
			},
			{
				username: "adminJabarBandung",
				password: hashedPassword,
				roleId: roleEnum.CITY_ADMIN,
				regionId: 7
			},
			{
				username: "adminJabarBandungCoblong",
				password: hashedPassword,
				roleId: roleEnum.DISTRICT_ADMIN,
				regionId: 12
			},
			{
				username: "adminJabarBandungCoblongDago",
				password: hashedPassword,
				roleId: roleEnum.VILLAGE_ADMIN,
				regionId: 21
			},
		],
	});
}

export default userSeeder;