import { authOptions } from '@/auth'
import { buildShortLink } from '@/app/features/links/utils/shortLink'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

function normalizeSlug(value: string) {
	return value
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9-_]/g, '')
		.replace(/-{2,}/g, '-')
		.replace(/^-|-$/g, '')
}

const MIN_SLUG_LENGTH = 3
const MAX_SLUG_LENGTH = 25
type UiStatus = 'active' | 'paused' | 'expired' | 'deleted'
type SortFieldApi =
	| 'created_date'
	| 'clicks'
	| 'title'
	| 'status'
	| 'expiration_date'
type SortOrderApi = 'asc' | 'desc'

function normalizeUrl(value: string) {
	const raw = value.trim()
	try {
		const url = new URL(raw)
		if (!['http:', 'https:'].includes(url.protocol)) return null
		return url.toString()
	} catch {
		return null
	}
}

function normalizeTitle(value: unknown) {
	const title = String(value ?? '').trim()
	return title ? title.slice(0, 120) : null
}

function normalizeExpiresAt(value: unknown) {
	if (!value) return null
	const date = new Date(String(value))
	if (Number.isNaN(date.getTime())) return null
	return date
}

function mapStatus(params: {
	status: 'active' | 'disabled' | 'expired'
	expiresAt: Date | null
	deletedAt: Date | null
}) {
	if (params.deletedAt) return 'deleted'
	if (params.expiresAt && params.expiresAt.getTime() <= Date.now()) {
		return 'expired'
	}
	if (params.status === 'disabled') return 'paused'
	if (params.status === 'expired') return 'expired'
	return 'active'
}

function parseTagFilters(req: Request): string[] {
	const url = new URL(req.url)
	const multi = url.searchParams.getAll('tags')
	const csv = (url.searchParams.get('tags') || '')
		.split(',')
		.map(v => v.trim())
		.filter(Boolean)

	return [...new Set([...multi, ...csv].map(v => v.trim()).filter(Boolean))]
}

function parseDatePreset(req: Request): '7d' | '30d' | null {
	const value = (new URL(req.url).searchParams.get('datePreset') || '').trim()
	if (value === '7d' || value === '30d') return value
	return null
}

function parseCreatedRange(req: Request): {
	from: Date | null
	to: Date | null
} {
	const url = new URL(req.url)
	const rawFrom = (url.searchParams.get('createdFrom') || '').trim()
	const rawTo = (url.searchParams.get('createdTo') || '').trim()

	const from = rawFrom ? new Date(rawFrom) : null
	const to = rawTo ? new Date(rawTo) : null

	return {
		from: from && !Number.isNaN(from.getTime()) ? from : null,
		to: to && !Number.isNaN(to.getTime()) ? to : null
	}
}

function parseStatusFilters(req: Request): UiStatus[] {
	const url = new URL(req.url)
	const multi = url.searchParams.getAll('status')
	const csv = (url.searchParams.get('status') || '')
		.split(',')
		.map(v => v.trim())
		.filter(Boolean)

	const allowed: UiStatus[] = ['active', 'paused', 'expired', 'deleted']
	return [...new Set([...multi, ...csv])].filter((v): v is UiStatus =>
		allowed.includes(v as UiStatus)
	)
}

function parseSearch(req: Request): string | null {
	const raw = (new URL(req.url).searchParams.get('search') || '').trim()
	return raw ? raw.slice(0, 120) : null
}

function parsePositiveInt(raw: string | null, fallback: number) {
	const n = Number(raw)
	return Number.isInteger(n) && n > 0 ? n : fallback
}

function parsePage(req: Request) {
	return parsePositiveInt(new URL(req.url).searchParams.get('page'), 1)
}

function parsePageSize(req: Request) {
	const n = parsePositiveInt(new URL(req.url).searchParams.get('pageSize'), 10)
	return [10, 25, 50].includes(n) ? n : 10
}

function parseSort(req: Request): { field: SortFieldApi; order: SortOrderApi } {
	const url = new URL(req.url)
	const fieldRaw = (url.searchParams.get('sort') || 'created_date').trim()
	const orderRaw = (url.searchParams.get('order') || 'desc').trim()

	const field: SortFieldApi = [
		'created_date',
		'clicks',
		'title',
		'status',
		'expiration_date'
	].includes(fieldRaw)
		? (fieldRaw as SortFieldApi)
		: 'created_date'

	const order: SortOrderApi = orderRaw === 'asc' ? 'asc' : 'desc'
	return { field, order }
}

export async function GET(req: Request) {
	const session = await getServerSession(authOptions)
	const userId = session?.user?.id

	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const tagsFilter = parseTagFilters(req)
	const statusFilters = parseStatusFilters(req)
	const search = parseSearch(req)
	const page = parsePage(req)
	const pageSize = parsePageSize(req)
	const { field: sortField, order: sortOrder } = parseSort(req)
	const datePreset = parseDatePreset(req)
	const createdRange = parseCreatedRange(req)
	const now = new Date()
	const createdAtFilter =
		createdRange.from || createdRange.to
			? {
					...(createdRange.from ? { gte: createdRange.from } : {}),
					...(createdRange.to ? { lte: createdRange.to } : {})
			  }
			: datePreset === '7d'
				? { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
				: datePreset === '30d'
					? { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
					: undefined

	const statusWhere = statusFilters.length
		? {
				OR: [
					...(statusFilters.includes('deleted')
						? [{ deletedAt: { not: null } }]
						: []),
					...(statusFilters.includes('active')
						? [
								{
									deletedAt: null,
									status: 'active',
									OR: [{ expiresAt: null }, { expiresAt: { gt: now } }]
								}
						  ]
						: []),
					...(statusFilters.includes('paused')
						? [
								{
									deletedAt: null,
									status: 'disabled',
									OR: [{ expiresAt: null }, { expiresAt: { gt: now } }]
								}
						  ]
						: []),
					...(statusFilters.includes('expired')
						? [
								{
									deletedAt: null,
									OR: [{ status: 'expired' }, { expiresAt: { lte: now } }]
								}
						  ]
						: [])
				]
		  }
		: { deletedAt: null }

	const andClauses: any[] = [statusWhere]

	if (createdAtFilter) {
		andClauses.push({ createdAt: createdAtFilter })
	}

	if (tagsFilter.length) {
		andClauses.push({
			tags: {
				some: {
					tag: {
						name: { in: tagsFilter }
					}
				}
			}
		})
	}

	if (search) {
		andClauses.push({
			OR: [
				{ title: { contains: search, mode: 'insensitive' } },
				{ slug: { contains: search, mode: 'insensitive' } },
				{ targetUrl: { contains: search, mode: 'insensitive' } }
			]
		})
	}

	const where: any = {
		userId,
		...(andClauses.length ? { AND: andClauses } : {})
	}

	const orderBy =
		sortField === 'clicks'
			? [{ clicksTotal: sortOrder }, { createdAt: 'desc' as const }]
			: sortField === 'title'
				? [{ title: sortOrder }, { createdAt: 'desc' as const }]
				: sortField === 'status'
					? [{ status: sortOrder }, { createdAt: 'desc' as const }]
					: sortField === 'expiration_date'
						? [{ expiresAt: sortOrder }, { createdAt: 'desc' as const }]
						: [{ createdAt: sortOrder }]

	const [links, totalAll, totalFiltered] = await Promise.all([
		prisma.link.findMany({
			where,
			orderBy,
			skip: (page - 1) * pageSize,
			take: pageSize,
			select: {
				id: true,
				title: true,
				slug: true,
				targetUrl: true,
				clicksTotal: true,
				status: true,
				createdAt: true,
				expiresAt: true,
				deletedAt: true,
				passwordHash: true,
				tags: {
					select: {
						tag: {
							select: {
								name: true
							}
						}
					}
				}
			}
		}),
		prisma.link.count({ where: { userId } }),
		prisma.link.count({ where })
	])

	const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize))

	return NextResponse.json({
		links: links.map(link => ({
			id: link.id,
			title: link.title || 'Без названия',
			shortUrl: buildShortLink(link.slug),
			destination: link.targetUrl,
			clicks: link.clicksTotal,
			status: mapStatus({
				status: link.status,
				expiresAt: link.expiresAt,
				deletedAt: link.deletedAt
			}),
			tags: link.tags.map(tagRel => tagRel.tag.name),
			createdAt: link.createdAt.toISOString(),
			expirationDate: link.expiresAt?.toISOString() ?? null,
			hasPassword: !!link.passwordHash
		})),
		meta: {
			totalAll,
			totalFiltered,
			page,
			pageSize,
			totalPages
		}
	})
}

export async function POST(req: Request) {
	const session = await getServerSession(authOptions)
	const userId = session?.user?.id

	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const body = await req.json().catch(() => null)

	const targetUrl = normalizeUrl(String(body?.targetUrl ?? ''))
	const slug = normalizeSlug(String(body?.slug ?? ''))
	const title = normalizeTitle(body?.title)
	const expiresAt = normalizeExpiresAt(body?.expiresAt)
	const rawPassword = String(body?.password ?? '').trim()
	const tagIds: string[] = Array.isArray(body?.tagIds)
		? body.tagIds.filter((id: unknown) => typeof id === 'string')
		: []

	if (!targetUrl) {
		return NextResponse.json(
			{ error: 'Invalid target URL' },
			{ status: 400 }
		)
	}

	if (
		!slug ||
		slug.length < MIN_SLUG_LENGTH ||
		slug.length > MAX_SLUG_LENGTH
	) {
		return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })
	}

	if (expiresAt && expiresAt.getTime() <= Date.now()) {
		return NextResponse.json(
			{ error: 'Expiration date must be in the future' },
			{ status: 400 }
		)
	}

	let passwordHash: string | null = null
	if (rawPassword) {
		if (rawPassword.length < 6 || rawPassword.length > 128) {
			return NextResponse.json(
				{ error: 'Invalid password length' },
				{ status: 400 }
			)
		}
		passwordHash = await bcrypt.hash(rawPassword, 10)
	}

	const existing = await prisma.link.findUnique({
		where: { slug },
		select: { id: true }
	})

	if (existing) {
		return NextResponse.json(
			{ error: 'Slug already taken' },
			{ status: 409 }
		)
	}

	if (tagIds.length) {
		const ownedTags = await prisma.tag.findMany({
			where: { id: { in: tagIds }, userId },
			select: { id: true }
		})

		if (ownedTags.length !== new Set(tagIds).size) {
			return NextResponse.json(
				{ error: 'Some tags are invalid' },
				{ status: 400 }
			)
		}
	}

	const created = await prisma.$transaction(async tx => {
		const link = await tx.link.create({
			data: {
				userId,
				targetUrl,
				slug,
				title,
				passwordHash,
				expiresAt
			},
			select: {
				id: true,
				targetUrl: true,
				slug: true,
				title: true,
				expiresAt: true,
				createdAt: true
			}
		})

		if (tagIds.length) {
			await tx.linkTag.createMany({
				data: [...new Set(tagIds)].map(tagId => ({
					linkId: link.id,
					tagId
				}))
			})
		}

		await tx.userUsage.update({
			where: { userId },
			data: { linksCreated: { increment: 1 } }
		})

		return link
	})

	return NextResponse.json({ link: created }, { status: 201 })
}

