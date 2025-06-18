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
		],
	});
}

export default userSeeder;