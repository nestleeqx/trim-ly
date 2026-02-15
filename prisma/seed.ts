import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'
import { PrismaClient } from '../app/generated/prisma/client'

const adapter = new PrismaPg({
	connectionString: process.env.DATABASE_URL
})

const prisma = new PrismaClient({
	adapter
})

async function main() {
	const free = await prisma.plan.upsert({
		where: { id: 'free' },
		update: {},
		create: {
			id: 'free',
			name: 'Free',
			linksLimit: 10,
			clicksLimit: 1000
		}
	})

	const pro = await prisma.plan.upsert({
		where: { id: 'pro' },
		update: {},
		create: {
			id: 'pro',
			name: 'Pro',
			linksLimit: 1000,
			clicksLimit: 100000
		}
	})

	const team = await prisma.plan.upsert({
		where: { id: 'team' },
		update: {},
		create: {
			id: 'team',
			name: 'Team',
			linksLimit: 10000,
			clicksLimit: 1000000
		}
	})

	console.log('Seeded plans:', [free.id, pro.id, team.id].join(', '))
}

main()
	.catch(e => {
		console.error(e)
		process.exit(1)
	})
	.finally(() => process.exit(0))
