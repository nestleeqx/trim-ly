'use client'

import { LucideIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import styles from './StatCard.module.scss'

interface StatCardProps {
	icon: LucideIcon
	value: string
	label: string
	change: number
	iconBgColor: string
	filterKey: string
}

export const StatCard: React.FC<StatCardProps> = ({
	icon: Icon,
	value,
	label,
	change,
	iconBgColor,
	filterKey
}) => {
	const router = useRouter()

	const handleClick = useCallback(() => {
		router.push(`/analytics?filter=${filterKey}`)
	}, [router, filterKey])

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === 'Enter' || e.key === ' ') {
				handleClick()
			}
		},
		[handleClick]
	)

	const isPositive = change >= 0

	return (
		<div
			className={styles.card}
			onClick={handleClick}
			role='button'
			tabIndex={0}
			onKeyDown={handleKeyDown}
			aria-label={`${label}: ${value}. Нажмите для просмотра деталей`}
		>
			<div className={styles.header}>
				<div
					className={styles.iconWrapper}
					style={{ backgroundColor: iconBgColor }}
				>
					<Icon size={20} />
				</div>
				<span
					className={`${styles.change} ${isPositive ? styles.positive : styles.negative}`}
				>
					{isPositive ? '+' : ''}
					{change}%
				</span>
			</div>
			<div className={styles.content}>
				<span className={styles.value}>{value}</span>
				<span className={styles.label}>{label}</span>
			</div>
		</div>
	)
}
