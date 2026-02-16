'use client'

import cn from 'classnames'
import { LayoutGrid, List } from 'lucide-react'
import { useEffect, useState } from 'react'
import styles from './ViewToggle.module.scss'

interface ViewToggleProps {
	viewMode: 'list' | 'grid'
	onViewModeChange: (mode: 'list' | 'grid') => void
}

export default function ViewToggle({
	viewMode,
	onViewModeChange
}: ViewToggleProps) {
	const [isMobile, setIsMobile] = useState(false)
	const [isTableVisible, setIsTableVisible] = useState(true)

	useEffect(() => {
		const checkMobile = () => {
			const mobile = window.innerWidth < 768
			setIsMobile(mobile)

			if (mobile && viewMode === 'list') {
				onViewModeChange('grid')
			}
		}

		checkMobile()
		window.addEventListener('resize', checkMobile)
		return () => window.removeEventListener('resize', checkMobile)
	}, [viewMode, onViewModeChange])

	const toggleTableVisibility = () => {
		if (isMobile) {
			setIsTableVisible(!isTableVisible)
			if (isTableVisible) {
				onViewModeChange('grid')
			} else {
				onViewModeChange('list')
			}
		}
	}

	if (isMobile && !isTableVisible) {
		return (
			<div className={styles.container}>
				<button
					className={cn(styles.viewBtn, styles.active)}
					onClick={toggleTableVisibility}
					aria-label='Показать таблицу'
				>
					<LayoutGrid size={18} />
				</button>
			</div>
		)
	}

	return (
		<div className={styles.container}>
			{(!isMobile || isTableVisible) && (
				<button
					className={cn(styles.viewBtn, {
						[styles.active]: viewMode === 'list'
					})}
					onClick={() => {
						if (isMobile) {
							setIsTableVisible(true)
						}
						onViewModeChange('list')
					}}
					aria-label='Таблица'
				>
					<List size={18} />
				</button>
			)}

			<button
				className={cn(styles.viewBtn, {
					[styles.active]: viewMode === 'grid'
				})}
				onClick={() => onViewModeChange('grid')}
				aria-label='Карточки'
			>
				<LayoutGrid size={18} />
			</button>
		</div>
	)
}
