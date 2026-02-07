import classNames from 'classnames'
import styles from './ProductPreview.module.scss'
import { PreviewTab, previewTabs } from './preview.config'

interface PreviewTabsProps {
	activeTab: PreviewTab
	onTabChange: (tab: PreviewTab) => void
	onAnalyticsClick: () => void
}

export const PreviewTabs: React.FC<PreviewTabsProps> = ({
	activeTab,
	onTabChange,
	onAnalyticsClick
}) => {
	const handleTabClick = (tab: PreviewTab, scrollToSection?: string) => {
		if (scrollToSection) {
			onAnalyticsClick()
		}
		onTabChange(tab)
	}

	return (
		<div className={styles.tabs}>
			{previewTabs.map(tab => (
				<button
					key={tab.id}
					className={classNames(styles.tab, {
						[styles.active]: activeTab === tab.id
					})}
					onClick={() => handleTabClick(tab.id, tab.scrollToSection)}
				>
					{tab.label}
				</button>
			))}
		</div>
	)
}
