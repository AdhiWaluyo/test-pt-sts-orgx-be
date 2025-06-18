import db from '@/utils/db.server';

const roleSeeder = async () => {
	await db.role.createMany({
		data: [
			{
				name: 'Central Admin',
				description: 'People who can access all features',
				accessLevel: 1,
			},
			{
				name: 'Province Admin',
				description: 'People who can access data related to their province',
				accessLevel: 2,
			},
			{
				name: 'City Admin',
				description: 'People who can access data related to their city',
				accessLevel: 3,
			},
			{
				name: 'District Admin',
				description: 'People who can access data related to their district',
				accessLevel: 4,
			},
			{
				name: 'Village Admin',
				description: 'People who can access data related to their village',
				accessLevel: 5,
			}
		]
	});
}

export default roleSeeder;