import { authOptions } from '@/auth'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

export async function GET() {
	const session = await getServerSession(authOptions)
	const userId = session?.user?.id

	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

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

	if (!user || !user.plan) {
		return NextResponse.json({ error: 'User not found' }, { status: 404 })
	}

	return NextResponse.json({
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
	})
}
