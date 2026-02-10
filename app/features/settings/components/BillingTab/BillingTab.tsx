import TabCard from '../TabCard/TabCard'
import { mockInvoices, mockUsageMetrics } from './billing.config'
import styles from './BillingTab.module.scss'
import CurrentPlanCard from './CurrentPlanCard'
import InvoiceHistoryTable from './InvoiceHistoryTable'
import UsageStatsCard from './UsageStatsCard/UsageStatsCard'

export default function BillingTab() {
	return (
		<TabCard
			title='Оплата'
			subtitle='Управляйте подпиской и способами оплаты.'
		>
			<>
				<div className={styles.topGrid}>
					<CurrentPlanCard />
					<UsageStatsCard metrics={mockUsageMetrics} />
				</div>

				<InvoiceHistoryTable invoices={mockInvoices} />
			</>
		</TabCard>
	)
}
