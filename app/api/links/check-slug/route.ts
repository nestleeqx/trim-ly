import { authOptions } from '@/auth'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

const MIN_SLUG_LENGTH = 3
const MAX_SLUG_LENGTH = 25

function normalizeSlug(value: string) {
	return value
		.trim()
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/[^a-z0-9-]/g, '')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '')
}

function buildCandidateSuggestions(slug: string) {
	const year = new Date().getFullYear()
	return Array.from(
		new Set([
			`${slug}-1`,
			`${slug}-${year}`,
			`${slug}-app`,
			`${slug}-link`,
			`${slug}-new`
		])
	).map(item => item.toLowerCase().slice(0, MAX_SLUG_LENGTH))
}

export async function GET(req: Request) {
	const session = await getServerSession(authOptions)
	const userId = session?.user?.id
	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const { searchParams } = new URL(req.url)
	const rawSlug = searchParams.get('slug') ?? ''
	const excludeId = searchParams.get('excludeId') ?? ''
	const slug = normalizeSlug(rawSlug)

	if (
		!slug ||
		slug.length < MIN_SLUG_LENGTH ||
		slug.length > MAX_SLUG_LENGTH
	) {
		return NextResponse.json(
			{ available: false, suggestions: [] },
			{ status: 200 }
		)
	}

	const existing = await prisma.link.findUnique({
		where: { slug },
		select: { id: true }
	})

	if (!existing || existing.id === excludeId) {
		return NextResponse.json({ available: true, suggestions: [] })
	}

	const candidates = buildCandidateSuggestions(slug).filter(
		item => item && item !== slug
	)

	const taken = await prisma.link.findMany({
		where: { slug: { in: candidates } },
		select: { slug: true }
	})

	const takenSet = new Set(taken.map(item => item.slug))
	const suggestions = candidates
		.filter(item => !takenSet.has(item))
		.slice(0, 3)

	return NextResponse.json({
		available: false,
		suggestions
	})
}

