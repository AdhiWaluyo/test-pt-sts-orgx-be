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
				name: 'City Admin',
				description: 'People who can access data related to their city',
				accessLevel: 2,
			},
			{
				name: 'District Admin',
				description: 'People who can access data related to their district',
				accessLevel: 3,
			},
			{
				name: 'Village Admin',
				description: 'People who can access data related to their village',
				accessLevel: 4,
			}
		]
	});
}

export default roleSeeder;