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
	clickable?: boolean
}

export const StatCard: React.FC<StatCardProps> = ({
	icon: Icon,
	value,
	label,
	change,
	iconBgColor,
	filterKey,
	clickable = true
}) => {
	const router = useRouter()

	const handleClick = useCallback(() => {
		if (clickable) {
			router.push(`/analytics?filter=${filterKey}`)
		}
	}, [router, filterKey, clickable])

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (clickable && (e.key === 'Enter' || e.key === ' ')) {
				handleClick()
			}
		},
		[handleClick, clickable]
	)

	const isPositive = change >= 0

	return (
		<div
			className={`${styles.card} ${clickable ? styles.clickable : ''}`}
			onClick={clickable ? handleClick : undefined}
			role={clickable ? 'button' : undefined}
			tabIndex={clickable ? 0 : undefined}
			onKeyDown={clickable ? handleKeyDown : undefined}
			aria-label={
				clickable
					? `${label}: ${value}. Нажмите для просмотра деталей`
					: `${label}: ${value}`
			}
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
