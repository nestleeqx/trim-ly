import FAQList from '@/app/components/ui/FAQ/FAQList'
import styles from './page.module.scss'
import { faqItems } from './pricing.config'

export const FAQSection: React.FC = () => {
	return (
		<div className={styles.faqSection}>
			<div className={styles.faqHeader}>
				<h3 className={styles.faqTitle}>Часто задаваемые вопросы</h3>
			</div>

			<div className={styles.faqAccordion}>
				<FAQList
					items={faqItems}
					initialOpenIndex={null}
				/>
			</div>
		</div>
	)
}
