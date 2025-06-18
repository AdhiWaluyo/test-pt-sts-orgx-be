import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
	db?: PrismaClient;
};

function createPrismaClient(): PrismaClient {
	const options: ConstructorParameters<typeof PrismaClient>[0] = {};

	if (process.env.APP_DEBUG?.trim().toLowerCase() === "true") {
		options.log = ['query'];
	}

	return new PrismaClient(options);
}

export const db = globalForPrisma.db ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.db = db;
}

process.on('beforeExit', async () => {
	await db.$disconnect();
});

process.on("SIGINT", async () => {
	await db.$disconnect();
	process.exit(0);
});

process.on("SIGTERM", async () => {
	await db.$disconnect();
	process.exit(0);
});


export default db;
