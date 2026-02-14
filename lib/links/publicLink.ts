import prisma from '@/lib/prisma'
import { createHash } from 'crypto'

type LinkRecord = {
	id: string
	userId: string
	targetUrl: string
	passwordHash: string | null
	expiresAt: Date | null
	status: 'active' | 'disabled' | 'expired'
	deletedAt: Date | null
}

export type PublicLinkState =
	| { state: 'not-found' }
	| { state: 'paused' }
	| { state: 'expired' }
	| { state: 'password'; link: LinkRecord & { passwordHash: string } }
	| { state: 'redirect'; link: LinkRecord }

function normalizeSlug(value: string) {
	return value
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9-_]/g, '')
}

function resolveState(link: LinkRecord | null): PublicLinkState {
	if (!link || link.deletedAt) return { state: 'not-found' }

	const isExpiredByDate =
		!!link.expiresAt && link.expiresAt.getTime() <= Date.now()
	if (link.status === 'expired' || isExpiredByDate) return { state: 'expired' }
	if (link.status === 'disabled') return { state: 'paused' }
	if (link.passwordHash) {
		return {
			state: 'password',
			link: { ...link, passwordHash: link.passwordHash }
		}
	}

	return { state: 'redirect', link }
}

export async function resolvePublicLink(slugRaw: string) {
	const slug = normalizeSlug(slugRaw)
	if (!slug) return { state: 'not-found' } as const

	const link = await prisma.link.findUnique({
		where: { slug },
		select: {
			id: true,
			userId: true,
			targetUrl: true,
			passwordHash: true,
			expiresAt: true,
			status: true,
			deletedAt: true
		}
	})

	return resolveState(link)
}

function getClientIp(headers: Headers) {
	const forwarded = headers.get('x-forwarded-for')
	if (forwarded) return forwarded.split(',')[0].trim()
	const realIp = headers.get('x-real-ip')
	return realIp?.trim() || null
}

export async function registerPublicClick(params: {
	linkId: string
	userId: string
	headers: Headers
}) {
	const { linkId, userId, headers } = params
	const userAgent = headers.get('user-agent')?.slice(0, 512) || null
	const referrer = headers.get('referer')?.slice(0, 2048) || null

	const rawIp = getClientIp(headers)
	const salt = process.env.IP_HASH_SALT || 'trimly'
	const ipHash = rawIp
		? createHash('sha256').update(`${salt}:${rawIp}`).digest('hex')
		: null

	await prisma.$transaction([
		prisma.link.update({
			where: { id: linkId },
			data: { clicksTotal: { increment: 1 } }
		}),
		prisma.userUsage.upsert({
			where: { userId },
			update: { clicksTotal: { increment: 1 } },
			create: { userId, clicksTotal: 1 }
		}),
		prisma.linkClickEvent.create({
			data: {
				linkId,
				ipHash,
				referrer,
				userAgent
			}
		})
	])
}
