import { authOptions } from '@/auth'
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
const SHORT_LINK_DOMAIN = 't.ly/'

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
	if (
		params.expiresAt &&
		params.expiresAt.getTime() <= Date.now()
	) {
		return 'expired'
	}
	if (params.status === 'disabled') return 'paused'
	if (params.status === 'expired') return 'expired'
	return 'active'
}

export async function GET() {
	const session = await getServerSession(authOptions)
	const userId = session?.user?.id

	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const links = await prisma.link.findMany({
		where: { userId, deletedAt: null },
		orderBy: { createdAt: 'desc' },
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
	})

	return NextResponse.json({
		links: links.map(link => ({
			id: link.id,
			title: link.title || 'Без названия',
			shortUrl: `${SHORT_LINK_DOMAIN}${link.slug}`,
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
		}))
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
