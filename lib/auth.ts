import prisma from './prisma'

function slugifyUsername(input: string) {
	return input
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '')
}

export async function generateUniqueUsername(base: string) {
	const baseSlug = slugifyUsername(base)

	const username = baseSlug || `user${Math.floor(Math.random() * 100000)}`

	// быстрая проверка
	const exists = await prisma.user.findUnique({ where: { username } })
	if (!exists) return username

	// несколько попыток с суффиксом
	for (let i = 0; i < 6; i++) {
		const candidate = `${username}-${Math.floor(Math.random() * 1000)}`
		const taken = await prisma.user.findUnique({
			where: { username: candidate }
		})
		if (!taken) return candidate
	}

	// fallback
	return `${username}-${Date.now()}`
}
