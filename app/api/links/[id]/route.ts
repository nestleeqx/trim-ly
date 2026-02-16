import { buildShortLink } from '@/app/features/links/utils/shortLink'
import { Prisma } from '@/app/generated/prisma/client'
import { authOptions } from '@/auth'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

type RouteContext = {
	params: Promise<{ id: string }>
}

const MIN_SLUG_LENGTH = 3
const MAX_SLUG_LENGTH = 25

function normalizeSlug(value: string) {
	return value
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9-_]/g, '')
		.replace(/-{2,}/g, '-')
		.replace(/^-|-$/g, '')
}

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

function slugifyTagName(value: string) {
	return value
		.trim()
		.toLowerCase()
		.replace(/[^\p{L}\p{N}\s_-]/gu, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '')
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

export async function GET(_: Request, context: RouteContext) {
	const session = await getServerSession(authOptions)
	const userId = session?.user?.id

	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const { id } = await context.params
	if (!id) {
		return NextResponse.json({ error: 'Invalid link id' }, { status: 400 })
	}

	const link = await prisma.link.findFirst({
		where: { id, userId },
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

	if (!link) {
		return NextResponse.json({ error: 'Link not found' }, { status: 404 })
	}

	return NextResponse.json({
		link: {
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
		}
	})
}

export async function PATCH(req: Request, context: RouteContext) {
	const session = await getServerSession(authOptions)
	const userId = session?.user?.id

	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const { id } = await context.params
	const body = await req.json().catch(() => null)

	if (!id) {
		return NextResponse.json({ error: 'Invalid link id' }, { status: 400 })
	}

	const action = String(body?.action ?? '').trim()

	if (action) {
		if (action !== 'pause' && action !== 'resume' && action !== 'restore') {
			return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
		}

		if (action === 'restore') {
			const affected = await prisma.$transaction(async tx => {
				const result = await tx.link.updateMany({
					where: { id, userId, deletedAt: { not: null } },
					data: { deletedAt: null, status: 'active' }
				})

				if (result.count > 0) {
					await tx.userUsage.upsert({
						where: { userId },
						create: { userId, linksCreated: result.count, clicksTotal: 0 },
						update: { linksCreated: { increment: result.count } }
					})
				}

				return result.count
			})

			if (affected === 0) {
				return NextResponse.json({ error: 'Link not found' }, { status: 404 })
			}
			return NextResponse.json({ ok: true })
		}

		const nextStatus = action === 'pause' ? 'disabled' : 'active'
		const result = await prisma.link.updateMany({
			where: { id, userId, deletedAt: null },
			data: { status: nextStatus }
		})

		if (result.count === 0) {
			return NextResponse.json({ error: 'Link not found' }, { status: 404 })
		}
		return NextResponse.json({ ok: true })
	}

	const targetUrl = normalizeUrl(String(body?.targetUrl ?? ''))
	const slug = normalizeSlug(String(body?.slug ?? ''))
	const title = normalizeTitle(body?.title)
	const expiresAt = normalizeExpiresAt(body?.expiresAt)
	const passwordEnabled = Boolean(body?.passwordEnabled)
	const rawPassword = String(body?.password ?? '').trim()
	const tagNamesRaw: string[] = Array.isArray(body?.tags)
		? body.tags.filter((v: unknown): v is string => typeof v === 'string')
		: []

	if (!targetUrl) {
		return NextResponse.json({ error: 'Invalid target URL' }, { status: 400 })
	}
	if (!slug || slug.length < MIN_SLUG_LENGTH || slug.length > MAX_SLUG_LENGTH) {
		return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })
	}
	if (expiresAt && expiresAt.getTime() <= Date.now()) {
		return NextResponse.json(
			{ error: 'Expiration date must be in the future' },
			{ status: 400 }
		)
	}

	const existingLink = await prisma.link.findFirst({
		where: { id, userId, deletedAt: null },
		select: { id: true, passwordHash: true }
	})
	if (!existingLink) {
		return NextResponse.json({ error: 'Link not found' }, { status: 404 })
	}

	const uniqueTagNames = [...new Set(tagNamesRaw.map(v => v.trim()).filter(Boolean))]
	if (uniqueTagNames.some(name => name.length > 20)) {
		return NextResponse.json({ error: 'Tag name is too long (max 20)' }, { status: 400 })
	}

	let passwordHashToSave: string | null
	if (!passwordEnabled) {
		passwordHashToSave = null
	} else if (rawPassword) {
		if (rawPassword.length < 6 || rawPassword.length > 128) {
			return NextResponse.json({ error: 'Invalid password length' }, { status: 400 })
		}
		passwordHashToSave = await bcrypt.hash(rawPassword, 10)
	} else {
		passwordHashToSave = existingLink.passwordHash
	}

	try {
		const updated = await prisma.$transaction(async tx => {
			const upsertedTags: Array<{ id: string }> = []

			for (const tagName of uniqueTagNames) {
				const tagSlug = slugifyTagName(tagName)
				if (!tagSlug) {
					throw new Error('Invalid tag name')
				}

				const tag = await tx.tag.upsert({
					where: {
						userId_slug: {
							userId,
							slug: tagSlug
						}
					},
					update: {
						name: tagName
					},
					create: {
						userId,
						name: tagName,
						slug: tagSlug
					},
					select: { id: true }
				})

				upsertedTags.push(tag)
			}

			const updatedResult = await tx.link.updateMany({
				where: { id, userId, deletedAt: null },
				data: {
					targetUrl,
					slug,
					title,
					expiresAt,
					passwordHash: passwordHashToSave
				}
			})

			if (updatedResult.count === 0) {
				throw new Error('Link not found')
			}

			await tx.linkTag.deleteMany({ where: { linkId: id } })

			if (upsertedTags.length) {
				await tx.linkTag.createMany({
					data: upsertedTags.map(tag => ({ linkId: id, tagId: tag.id }))
				})
			}

			return tx.link.findUnique({
				where: { id },
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
							tag: { select: { name: true } }
						}
					}
				}
			})
		})

		if (!updated) {
			return NextResponse.json({ error: 'Link not found' }, { status: 404 })
		}

		return NextResponse.json({
			link: {
				id: updated.id,
				title: updated.title || 'Без названия',
				shortUrl: buildShortLink(updated.slug),
				destination: updated.targetUrl,
				clicks: updated.clicksTotal,
				status: mapStatus({
					status: updated.status,
					expiresAt: updated.expiresAt,
					deletedAt: updated.deletedAt
				}),
				tags: updated.tags.map(tagRel => tagRel.tag.name),
				createdAt: updated.createdAt.toISOString(),
				expirationDate: updated.expiresAt?.toISOString() ?? null,
				hasPassword: !!updated.passwordHash
			}
		})
	} catch (error) {
		if (error instanceof Error) {
			if (error.message === 'Invalid tag name') {
				return NextResponse.json({ error: 'Invalid tag name' }, { status: 400 })
			}
			if (error.message === 'Link not found') {
				return NextResponse.json({ error: 'Link not found' }, { status: 404 })
			}
		}
		if (
			error instanceof Prisma.PrismaClientKnownRequestError &&
			error.code === 'P2002'
		) {
			return NextResponse.json({ error: 'Slug already taken' }, { status: 409 })
		}
		return NextResponse.json({ error: 'Internal error' }, { status: 500 })
	}
}

export async function DELETE(_: Request, context: RouteContext) {
	const session = await getServerSession(authOptions)
	const userId = session?.user?.id

	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const { id } = await context.params
	if (!id) {
		return NextResponse.json({ error: 'Invalid link id' }, { status: 400 })
	}

	const affected = await prisma.$transaction(async tx => {
		const result = await tx.link.updateMany({
			where: { id, userId, deletedAt: null },
			data: {
				deletedAt: new Date(),
				status: 'disabled'
			}
		})

		if (result.count > 0) {
			const usage = await tx.userUsage.findUnique({
				where: { userId },
				select: { linksCreated: true }
			})
			await tx.userUsage.upsert({
				where: { userId },
				create: { userId, linksCreated: 0, clicksTotal: 0 },
				update: {
					linksCreated: Math.max(
						0,
						(usage?.linksCreated ?? 0) - result.count
					)
				}
			})
		}

		return result.count
	})

	if (affected === 0) {
		return NextResponse.json({ error: 'Link not found' }, { status: 404 })
	}

	return NextResponse.json({ ok: true })
}
