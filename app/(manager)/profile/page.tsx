'use client'

import styles from '@/app/(manager)/profile/page.module.scss'
import DashboardHeader from '@/app/components/layout/DashboardHeader/DashboardHeader'
import BillingTab from '@/app/features/profile/components/BillingTab/BillingTab'
import DangerTab from '@/app/features/profile/components/DangerTab/DangerTab'
import PreferenceTab from '@/app/features/profile/components/PreferenceTab/PreferenceTab'
import ProfileTab from '@/app/features/profile/components/ProfileTab/ProfileTab'
import SecurityTab from '@/app/features/profile/components/SecurityTab/SecurityTab'
import cn from 'classnames'
import { AlertTriangle, CreditCard, Palette, Shield, User } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'

type Tab = 'profile' | 'security' | 'preferences' | 'billing' | 'danger'
const TAB_KEYS: Tab[] = ['profile', 'security', 'preferences', 'billing', 'danger']

function isTab(value: string | null): value is Tab {
	return !!value && TAB_KEYS.includes(value as Tab)
}

export default function SettingsPage() {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	const activeTab: Tab = useMemo(() => {
		const raw = searchParams.get('tab')
		return isTab(raw) ? raw : 'profile'
	}, [searchParams])

	const setTab = useCallback(
		(tab: Tab) => {
			const params = new URLSearchParams(searchParams.toString())
			params.set('tab', tab)
			router.replace(`${pathname}?${params.toString()}`, { scroll: false })
		},
		[pathname, router, searchParams]
	)

	const tabs = [
		{ key: 'profile' as Tab, label: 'Профиль', icon: User },
		{ key: 'security' as Tab, label: 'Безопасность', icon: Shield },
		{ key: 'preferences' as Tab, label: 'Оформление', icon: Palette },
		{ key: 'billing' as Tab, label: 'Оплата', icon: CreditCard },
		{
			key: 'danger' as Tab,
			label: 'Опасные действия',
			icon: AlertTriangle,
			danger: true
		}
	]

	const renderContent = () => {
		switch (activeTab) {
			case 'profile':
				return <ProfileTab />
			case 'security':
				return <SecurityTab />
			case 'preferences':
				return <PreferenceTab />
			case 'billing':
				return <BillingTab />
			case 'danger':
				return <DangerTab />
			default:
				return <ProfileTab />
		}
	}

	return (
		<>
			<DashboardHeader
				title='Настройки'
				subtitle='Обзор вашего аккаунта.'
			/>

			<div className={styles.page}>
				<div className={styles.layout}>
					<aside className={styles.sidebar}>
						<ul>
							{tabs.map(tab => {
								const Icon = tab.icon
								return (
									<li key={tab.key}>
										<button
											type='button'
											className={cn(styles.tabButton, {
												[styles.active]: activeTab === tab.key,
												[styles.danger]: tab.danger
											})}
											onClick={() => setTab(tab.key)}
										>
											<Icon size={19} />
											<span>{tab.label}</span>
										</button>
									</li>
								)
							})}
						</ul>
					</aside>

					<div className={styles.mobileTabs}>
						<div className={styles.mobileTabsScroll}>
							{tabs.map(tab => {
								const Icon = tab.icon
								return (
									<button
										type='button'
										key={tab.key}
										className={cn(styles.mobileTabButton, {
											[styles.active]: activeTab === tab.key,
											[styles.danger]: tab.danger
										})}
										onClick={() => setTab(tab.key)}
									>
										<Icon size={16} />
										<span>{tab.label}</span>
									</button>
								)
							})}
						</div>
					</div>

					<div className={styles.content}>{renderContent()}</div>
				</div>
			</div>
		</>
	)
}
