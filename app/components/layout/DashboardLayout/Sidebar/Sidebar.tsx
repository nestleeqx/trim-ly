'use client'

import Logo from '@/app/components/ui/Logo/Logo'
import { useSidebar } from '@/hooks/useSidebar'
import classNames from 'classnames'
import { Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import styles from './Sidebar.module.scss'
import SidebarNav from './SidebarNav/SidebarNav'
import StorageUsage from './StorageUsage'
import UpgradeBanner from './UpgradeBanner'

interface SidebarProps {
	usedLinks?: number
	maxLinks?: number
	planName?: string
}

type BillingResponse = {
	plan: { id: string; name: string }
	usage: { linksCreated: number; linksLimit: number }
}

function normalizePlanName(planId: string, planName: string) {
	const id = planId.toLowerCase()
	const name = planName.toLowerCase()

	if (id === 'free' || name.includes('free')) return 'Бесплатный план'
	if (id === 'pro' || name.includes('pro')) return 'Pro'
	if (id === 'team' || name.includes('team')) return 'Команда'
	return planName
}

export default function Sidebar({
	usedLinks = 0,
	maxLinks = 0,
	planName = 'Бесплатный план'
}: SidebarProps) {
	const { isOpen, close, toggle } = useSidebar()
	const pathname = usePathname()
	const billingRefreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
	const [remoteUsage, setRemoteUsage] = useState<{
		usedLinks: number
		maxLinks: number
		planName: string
	} | null>(null)

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
				const data = (await res.json().catch(() => null)) as BillingResponse | null
				if (!res.ok || !data || !active) return

				setRemoteUsage({
					usedLinks: data.usage.linksCreated,
					maxLinks: data.usage.linksLimit,
					planName: normalizePlanName(data.plan.id, data.plan.name)
				})
			} catch (error) {
				if (error instanceof DOMException && error.name === 'AbortError') return
			}
		}

		void loadBilling()

		const handleBillingUpdated = () => {
			if (billingRefreshTimer.current) {
				clearTimeout(billingRefreshTimer.current)
			}
			billingRefreshTimer.current = setTimeout(() => {
				void loadBilling()
			}, 250)
		}

		window.addEventListener('billing-updated', handleBillingUpdated)
		return () => {
			active = false
			controller.abort()
			if (billingRefreshTimer.current) {
				clearTimeout(billingRefreshTimer.current)
				billingRefreshTimer.current = null
			}
			window.removeEventListener('billing-updated', handleBillingUpdated)
		}
	}, [pathname])

	const resolved = useMemo(
		() => ({
			usedLinks: remoteUsage?.usedLinks ?? usedLinks,
			maxLinks: remoteUsage?.maxLinks ?? maxLinks,
			planName: remoteUsage?.planName ?? planName
		}),
		[remoteUsage, usedLinks, maxLinks, planName]
	)

	const isLimitReached =
		resolved.maxLinks > 0 && resolved.usedLinks >= resolved.maxLinks

	return (
		<>
			<div
				className={classNames(styles.overlay, {
					[styles.visible]: isOpen
				})}
				onClick={close}
			/>

			<aside
				className={classNames(styles.sidebar, {
					[styles.open]: isOpen
				})}
			>
				<div className={styles.top}>
					<div className={styles.logoWrapper}>
						<Logo />
						<button
							className={styles.closeBtn}
							onClick={close}
						>
							<X size={20} />
						</button>
					</div>
					<SidebarNav onItemClick={close} />
				</div>

				<div className={styles.bottom}>
					<StorageUsage
						used={resolved.usedLinks}
						max={resolved.maxLinks}
						isLimitReached={isLimitReached}
					/>
					<UpgradeBanner
						planName={resolved.planName}
						isLimitReached={isLimitReached}
					/>
				</div>
			</aside>

			<button
				className={classNames(styles.mobileToggle, {
					[styles.hidden]: isOpen
				})}
				onClick={toggle}
				aria-label='Открыть меню'
			>
				<Menu size={24} />
			</button>
		</>
	)
}
