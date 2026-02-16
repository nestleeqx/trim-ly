'use client'

import Button from '@/app/components/ui/Button/Button'
import { Moon, Sun } from 'lucide-react'
import Link from 'next/link'
import styles from './MobileNav.module.scss'

interface MobileNavActionsProps {
	isAuthenticated: boolean
	resolvedTheme: string | undefined
	onToggleTheme: () => void
	onNavClick: () => void
}

export default function MobileNavActions({
	isAuthenticated,
	resolvedTheme,
	onToggleTheme,
	onNavClick
}: MobileNavActionsProps) {
	return (
		<div className={styles.menuActions}>
			<button
				className={styles.themeToggle}
				onClick={onToggleTheme}
				aria-label='Переключить тему'
			>
				{resolvedTheme === 'light' ? (
					<Moon size={20} />
				) : (
					<Sun size={20} />
				)}
				<span>
					{resolvedTheme === 'light' ? 'Тёмная тема' : 'Светлая тема'}
				</span>
			</button>

			{isAuthenticated ? (
				<Link
					href='/dashboard'
					onClick={onNavClick}
				>
					<Button
						variant='primary'
						size='lg'
						className={styles.fullWidth}
					>
						Личный кабинет
					</Button>
				</Link>
			) : (
				<>
					<Link
						href='/login'
						onClick={onNavClick}
					>
						<Button
							variant='ghost'
							size='lg'
							className={styles.fullWidth}
						>
							Войти
						</Button>
					</Link>
					<Link
						href='/signup'
						onClick={onNavClick}
					>
						<Button
							variant='primary'
							size='lg'
							className={styles.fullWidth}
						>
							Начать бесплатно
						</Button>
					</Link>
				</>
			)}
		</div>
	)
}
