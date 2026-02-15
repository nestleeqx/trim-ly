import { authOptions } from '@/auth'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

type SupportedPlanId = 'free' | 'pro' | 'team'

function normalizePlanId(value: unknown): SupportedPlanId | null {
	const raw = String(value ?? '')
		.trim()
		.toLowerCase()
	if (raw === 'free' || raw === 'pro' || raw === 'team') return raw
	return null
}

async function buildBillingResponse(userId: string) {
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: {
			plan: {
				select: {
					id: true,
					name: true,
					linksLimit: true,
					clicksLimit: true
				}
			},
			subscriptionStatus: true,
			usage: {
				select: {
					linksCreated: true,
					clicksTotal: true
				}
			}
		}
	})

	if (!user || !user.plan) return null

	return {
		plan: {
			id: user.plan.id,
			name: user.plan.name,
			status: user.subscriptionStatus ?? 'active'
		},
		usage: {
			linksCreated: user.usage?.linksCreated ?? 0,
			linksLimit: user.plan.linksLimit,
			clicksTotal: user.usage?.clicksTotal ?? 0,
			clicksLimit: user.plan.clicksLimit
		},
		invoices: []
	}
}

export async function GET() {
	const session = await getServerSession(authOptions)
	const userId = session?.user?.id

	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const response = await buildBillingResponse(userId)
	if (!response) {
		return NextResponse.json({ error: 'User not found' }, { status: 404 })
	}

	return NextResponse.json(response)
}

export async function PATCH(req: Request) {
	const session = await getServerSession(authOptions)
	const userId = session?.user?.id

	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const body = await req.json().catch(() => null)
	const planId = normalizePlanId(body?.planId)

	if (!planId) {
		return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
	}

	const plan = await prisma.plan.findUnique({
		where: { id: planId },
		select: { id: true }
	})

	if (!plan) {
		return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
	}

	await prisma.user.update({
		where: { id: userId },
		data: {
			planId: plan.id,
			subscriptionStatus: 'active'
		}
	})

	await prisma.userUsage.upsert({
		where: { userId },
		create: { userId },
		update: {}
	})

	const response = await buildBillingResponse(userId)
	if (!response) {
		return NextResponse.json({ error: 'User not found' }, { status: 404 })
	}

	return NextResponse.json(response)
}
