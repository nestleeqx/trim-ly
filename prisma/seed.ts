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

	console.log('Seeded plan:', free.id)
}

main()
	.catch(e => {
		console.error(e)
		process.exit(1)
	})
	.finally(() => process.exit(0))
