'use client'

import styles from '@/app/(manager)/settings/page.module.scss'
import DashboardHeader from '@/app/components/layout/DashboardHeader/DashboardHeader'
import BillingTab from '@/app/features/settings/components/BillingTab/BillingTab'
import DangerTab from '@/app/features/settings/components/TabCard/DangerTab/DangerTab'
import PreferenceTab from '@/app/features/settings/components/TabCard/PreferenceTab/PreferenceTab'
import ProfileTab from '@/app/features/settings/components/TabCard/ProfileTab/ProfileTab'
import SecurityTab from '@/app/features/settings/components/TabCard/SecurityTab/SecurityTab'
import { AlertTriangle, CreditCard, Palette, Shield, User } from 'lucide-react'
import { useState } from 'react'

type Tab = 'profile' | 'security' | 'preferences' | 'billing' | 'danger'

export default function SettingsPage() {
	const [activeTab, setActiveTab] = useState<Tab>('profile')

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
				return null
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
										onClick={() => setActiveTab(tab.key)}
										role='button'
										tabIndex={0}
										onKeyDown={e => {
											if (
												e.key === 'Enter' ||
												e.key === ' '
											) {
												setActiveTab(tab.key)
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
							onChange={e => setActiveTab(e.target.value as Tab)}
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
