'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'

type BillingResponse = {
	plan: { id: string; name: string }
	usage: { linksCreated: number; linksLimit: number }
}

interface UseSidebarBillingParams {
	usedLinks: number
	maxLinks: number
	planName: string
}

interface SidebarUsage {
	usedLinks: number
	maxLinks: number
	planName: string
}

function normalizePlanName(planId: string, planName: string) {
	const id = planId.toLowerCase()
	const name = planName.toLowerCase()

	if (id === 'free' || name.includes('free')) return 'Бесплатный план'
	if (id === 'pro' || name.includes('pro')) return 'Pro'
	if (id === 'team' || name.includes('team')) return 'Команда'
	return planName
}

export function useSidebarBilling({
	usedLinks,
	maxLinks,
	planName
}: UseSidebarBillingParams) {
	const pathname = usePathname()
	const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
	const [remoteUsage, setRemoteUsage] = useState<SidebarUsage | null>(null)

	useEffect(() => {
		let active = true
		const controller = new AbortController()

		const loadBilling = async () => {
			try {
				const res = await fetch('/api/profile/billing', {
					method: 'GET',
					cache: 'no-store',
					signal: controller.signal
				})
				const data = (await res
					.json()
					.catch(() => null)) as BillingResponse | null
				if (!res.ok || !data || !active) return

				setRemoteUsage({
					usedLinks: data.usage.linksCreated,
					maxLinks: data.usage.linksLimit,
					planName: normalizePlanName(data.plan.id, data.plan.name)
				})
			} catch (error) {
				if (
					error instanceof DOMException &&
					error.name === 'AbortError'
				) {
					return
				}
			}
		}

		void loadBilling()

		const handleBillingUpdated = () => {
			if (refreshTimer.current) clearTimeout(refreshTimer.current)
			refreshTimer.current = setTimeout(() => {
				void loadBilling()
			}, 250)
		}

		window.addEventListener('billing-updated', handleBillingUpdated)
		return () => {
			active = false
			controller.abort()
			if (refreshTimer.current) {
				clearTimeout(refreshTimer.current)
				refreshTimer.current = null
			}
			window.removeEventListener('billing-updated', handleBillingUpdated)
		}
	}, [pathname])

	return useMemo(
		() => ({
			usedLinks: remoteUsage?.usedLinks ?? usedLinks,
			maxLinks: remoteUsage?.maxLinks ?? maxLinks,
			planName: remoteUsage?.planName ?? planName
		}),
		[remoteUsage, usedLinks, maxLinks, planName]
	)
}
