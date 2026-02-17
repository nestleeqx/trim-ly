import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { PrismaClient } from '../app/generated/prisma/client'

const globalForPrisma = globalThis as unknown as {
	prisma?: PrismaClient
	pgPool?: Pool
}

const accelerateUrl = process.env.PRISMA_DATABASE_URL
const dbUrl = process.env.DATABASE_URL

const prisma = globalForPrisma.prisma ?? (() => {
	if (accelerateUrl) {
		return new PrismaClient({ accelerateUrl })
	}

	if (!dbUrl) {
		throw new Error('DATABASE_URL is not set')
	}

	const pgPool =
		globalForPrisma.pgPool ??
		new Pool({
			connectionString: dbUrl,
			max: 10,
			idleTimeoutMillis: 30_000,
			connectionTimeoutMillis: 10_000,
			allowExitOnIdle: true,
			keepAlive: true
		})

	if (process.env.NODE_ENV !== 'production') {
		globalForPrisma.pgPool = pgPool
	}

	return new PrismaClient({
		adapter: new PrismaPg(pgPool)
	})
})()

if (process.env.NODE_ENV !== 'production') {
	globalForPrisma.prisma = prisma
}

export default prisma
