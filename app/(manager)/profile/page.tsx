'use client'

import styles from '@/app/(manager)/profile/page.module.scss'
import DashboardHeader from '@/app/components/layout/DashboardHeader/DashboardHeader'
import BillingTab from '@/app/features/profile/components/BillingTab/BillingTab'
import DangerTab from '@/app/features/profile/components/DangerTab/DangerTab'
import PreferenceTab from '@/app/features/profile/components/PreferenceTab/PreferenceTab'
import ProfileTab from '@/app/features/profile/components/ProfileTab/ProfileTab'
import SecurityTab from '@/app/features/profile/components/SecurityTab/SecurityTab'
import { AlertTriangle, CreditCard, Palette, Shield, User } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'

type Tab = 'profile' | 'security' | 'preferences' | 'billing' | 'danger'
const TAB_KEYS: Tab[] = [
	'profile',
	'security',
	'preferences',
	'billing',
	'danger'
]

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
			router.replace(`${pathname}?${params.toString()}`, {
				scroll: false
			})
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
									<li
										key={tab.key}
										className={`${activeTab === tab.key ? styles.active : ''} ${
											tab.danger ? styles.danger : ''
										}`}
										onClick={() => setTab(tab.key)}
										role='button'
										tabIndex={0}
										onKeyDown={e => {
											if (
												e.key === 'Enter' ||
												e.key === ' '
											) {
												setTab(tab.key)
											}
										}}
									>
										<Icon size={19} />
										<span>{tab.label}</span>
									</li>
								)
							})}
						</ul>
					</aside>
					<div className={styles.mobileTabs}>
						<select
							value={activeTab}
							onChange={e => setTab(e.target.value as Tab)}
							className={styles.select}
						>
							{tabs.map(tab => (
								<option
									key={tab.key}
									value={tab.key}
								>
									{tab.label}
								</option>
							))}
						</select>
					</div>

					<div className={styles.content}>{renderContent()}</div>
				</div>
			</div>
		</>
	)
}
