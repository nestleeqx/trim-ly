'use client'

import Accordion from '@/app/components/ui/Accordion/Accordion'
import { Settings } from 'lucide-react'
import ExpirationSettings from './ExpirationSettings'
import styles from './LinkEdit.module.scss'
import PasswordSettings from './PasswordSettings'

interface AdvancedSettingsProps {
	expirationDate: string
	expirationError?: string
	passwordEnabled: boolean
	password: string
	passwordError?: string
	hasExistingPassword: boolean
	isOpen: boolean
	onExpirationChange: (value: string) => void
	onClearExpiration: () => void
	onPasswordToggle: () => void
	onPasswordChange: (value: string) => void
}

export default function AdvancedSettings({
	expirationDate,
	expirationError,
	passwordEnabled,
	password,
	passwordError,
	hasExistingPassword,
	isOpen,
	onExpirationChange,
	onClearExpiration,
	onPasswordToggle,
	onPasswordChange
}: AdvancedSettingsProps) {
	return (
		<Accordion
			title='Расширенные настройки'
			icon={<Settings size={18} />}
			initialOpen={isOpen}
		>
			<div className={styles.formRow}>
				<ExpirationSettings
					expirationDate={expirationDate}
					expirationError={expirationError}
					onExpirationChange={onExpirationChange}
					onClearExpiration={onClearExpiration}
				/>
				<PasswordSettings
					passwordEnabled={passwordEnabled}
					password={password}
					passwordError={passwordError}
					hasExistingPassword={hasExistingPassword}
					onPasswordToggle={onPasswordToggle}
					onPasswordChange={onPasswordChange}
				/>
			</div>
		</Accordion>
	)
}
