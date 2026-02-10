import FAQList from '@/app/components/ui/FAQ/FAQList'
import { faqItems } from '../../pricing.config'
import styles from './FAQSection.module.scss'

export default function FAQSection() {
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
