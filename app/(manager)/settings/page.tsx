'use client'

import BillingTab from '@/app/components/settings/BillingTab/BillingTab'
import DangerTab from '@/app/components/settings/DangerTab/DangerTab'
import SecurityTab from '@/app/components/settings/SecurityTab/SecurityTab'
import { AlertTriangle, CreditCard, Palette, Shield, User } from 'lucide-react'
import { useState } from 'react'
import DashboardHeader from '../../components/dashboard/DashboardHeader'
import PreferenceTab from '../../components/settings/PreferenceTab/PreferenceTab'
import ProfileTab from '../../components/settings/ProfileTab/ProfileTab'
import styles from './page.module.scss'

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
					{/* Desktop Sidebar */}
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

					{/* Mobile Tabs */}
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
