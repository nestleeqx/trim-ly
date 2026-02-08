'use client'

import { LayoutGrid, List } from 'lucide-react'
import { useEffect, useState } from 'react'
import styles from './ViewToggle.module.scss'

interface ViewToggleProps {
	viewMode: 'list' | 'grid'
	onViewModeChange: (mode: 'list' | 'grid') => void
}

const ViewToggle: React.FC<ViewToggleProps> = ({
	viewMode,
	onViewModeChange
}) => {
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
					className={`${styles.viewBtn} ${styles.active}`}
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
					className={`${styles.viewBtn} ${viewMode === 'list' ? styles.active : ''}`}
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
				className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.active : ''}`}
				onClick={() => onViewModeChange('grid')}
				aria-label='Карточки'
			>
				<LayoutGrid size={18} />
			</button>
		</div>
	)
}

export default ViewToggle
