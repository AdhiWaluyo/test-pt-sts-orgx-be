import userSeeder from "../src/app/users/user.seeder";
import roleSeeder from "../src/app/roles/role.seeder";
import regionSeeder from "../src/app/regions/regions.seeder";
import db from '../src/utils/db.server';
async function seed() {
	await regionSeeder();
	await roleSeeder();
	await userSeeder();
}

seed()
	.then(async () => {
		await db.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await db.$disconnect()
		process.exit(1)
	})