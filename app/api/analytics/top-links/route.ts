import { buildShortLink } from '@/app/features/links/utils/shortLink'
import { authOptions } from '@/auth'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

type AnalyticsPeriod = '24h' | '7d' | '30d' | '90d'

const HOUR_MS = 60 * 60 * 1000
const DAY_MS = 24 * HOUR_MS

function parsePeriod(req: Request): AnalyticsPeriod {
	const raw = (new URL(req.url).searchParams.get('period') || '24h').trim()
	if (raw === '7d' || raw === '30d' || raw === '90d') return raw
	return '24h'
}

function getRange(period: AnalyticsPeriod) {
	const to = new Date()
	if (period === '24h') {
		return { from: new Date(to.getTime() - DAY_MS), to }
	}
	const days = period === '90d' ? 90 : period === '30d' ? 30 : 7
	return { from: new Date(to.getTime() - days * DAY_MS), to }
}

function normalizeDevice(
	deviceType: string | null,
	userAgent: string | null
): 'Mobile' | 'Desktop' | 'Tablet' | 'Other' {
	const raw = (deviceType || '').toLowerCase()
	if (raw.includes('mobile')) return 'Mobile'
	if (raw.includes('tablet')) return 'Tablet'
	if (raw.includes('desktop')) return 'Desktop'
	if (!userAgent) return 'Other'

	const ua = userAgent.toLowerCase()
	if (ua.includes('ipad') || ua.includes('tablet')) return 'Tablet'
	if (
		ua.includes('mobi') ||
		ua.includes('android') ||
		ua.includes('iphone')
	) {
		return 'Mobile'
	}
	if (
		ua.includes('macintosh') ||
		ua.includes('windows') ||
		ua.includes('linux')
	) {
		return 'Desktop'
	}
	return 'Other'
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

function extractReferrerHost(value: string | null) {
	if (!value) return 'direct'
	const input = value.trim()
	if (!input) return 'direct'
	try {
		const url = new URL(
			input.startsWith('http') ? input : `https://${input}`
		)
		return url.hostname.replace(/^www\./, '')
	} catch {
		return input.replace(/^www\./, '')
	}
}

function isTransientDbError(error: unknown): boolean {
	if (!(error instanceof Error)) return false
	const message = error.message.toLowerCase()
	return (
		message.includes('econnreset') ||
		message.includes('connection timeout') ||
		message.includes('server has closed the connection') ||
		message.includes('fetch failed')
	)
}

async function withRetry<T>(
	task: () => Promise<T>,
	maxAttempts = 2
): Promise<T> {
	let lastError: unknown
	for (let attempt = 1; attempt <= maxAttempts; attempt++) {
		try {
			return await task()
		} catch (error) {
			lastError = error
			if (!isTransientDbError(error) || attempt >= maxAttempts) {
				throw error
			}
			await new Promise(resolve => setTimeout(resolve, 150 * attempt))
		}
	}
	throw lastError
}

export async function GET(req: Request) {
	const session = await getServerSession(authOptions)
	const userId = session?.user?.id
	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const url = new URL(req.url)
	const period = parsePeriod(req)
	const selectedCountry =
		(url.searchParams.get('country') || '').trim() || null
	const selectedDevice = (url.searchParams.get('device') || '').trim() || null
	const selectedReferrer =
		(url.searchParams.get('referrer') || '').trim() || null
	const { from, to } = getRange(period)

	try {
		const events = await withRetry(() =>
			prisma.linkClickEvent.findMany({
				where: {
					clickedAt: { gte: from, lte: to },
					link: { userId, deletedAt: null }
				},
				select: {
					linkId: true,
					country: true,
					referrer: true,
					userAgent: true,
					deviceType: true
				}
			})
		)

		const clicksByLink = new Map<string, number>()

		for (const event of events) {
			const countryCode =
				event.country && event.country.length === 2
					? event.country.toUpperCase()
					: '--'
			const device = normalizeDevice(event.deviceType, event.userAgent)
			const eventReferrer = extractReferrerHost(event.referrer)

			if (selectedCountry && selectedCountry !== countryCode) continue
			if (selectedDevice && selectedDevice !== device) continue
			if (selectedReferrer && selectedReferrer !== eventReferrer) continue

			clicksByLink.set(
				event.linkId,
				(clicksByLink.get(event.linkId) || 0) + 1
			)
		}

		const top = [...clicksByLink.entries()]
			.sort((a, b) => b[1] - a[1])
			.slice(0, 10)

		if (top.length === 0) {
			return NextResponse.json({
				period,
				links: []
			})
		}

		const topIds = top.map(([id]) => id)
		const links = await withRetry(() =>
			prisma.link.findMany({
				where: {
					id: { in: topIds },
					userId,
					deletedAt: null
				},
				select: {
					id: true,
					title: true,
					slug: true,
					targetUrl: true,
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
		)

		const linkById = new Map(links.map(link => [link.id, link]))

		return NextResponse.json({
			period,
			links: top
				.map(([id, clicks]) => {
					const link = linkById.get(id)
					if (!link) return null
					return {
						id: link.id,
						title: link.title || 'Без названия',
						shortUrl: buildShortLink(link.slug),
						destination: link.targetUrl,
						clicks,
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
				.filter(Boolean)
		})
	} catch {
		return NextResponse.json(
			{
				error:
					'Временная ошибка соединения с базой данных. Повторите попытку.'
			},
			{ status: 503 }
		)
	}
}
