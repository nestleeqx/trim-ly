'use client'

import Button from '@/app/components/ui/Button/Button'
import Link from 'next/link'
import styles from '../../Header.module.scss'

interface DesktopHeaderActionsProps {
	isAuthenticated: boolean
}

export default function DesktopHeaderActions({
	isAuthenticated
}: DesktopHeaderActionsProps) {
	if (isAuthenticated) {
		return (
			<Link
				href='/dashboard'
				className={styles.desktopOnly}
			>
				<Button
					variant='primary'
					size='sm'
				>
					Личный кабинет
				</Button>
			</Link>
		)
	}

	return (
		<>
			<Link
				href='/login'
				className={styles.desktopOnly}
			>
				<Button
					variant='ghost'
					size='sm'
				>
					Войти
				</Button>
			</Link>
			<Link
				href='/signup'
				className={styles.desktopOnly}
			>
				<Button
					variant='primary'
					size='sm'
				>
					Начать бесплатно
				</Button>
			</Link>
		</>
	)
}
