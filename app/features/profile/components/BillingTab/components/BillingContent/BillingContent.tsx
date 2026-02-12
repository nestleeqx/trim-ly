import type { BillingResponse } from '@/app/features/profile/api/profileApi'
import styles from '../../BillingTab.module.scss'
import { demoInvoices } from '../../constants/demoInvoices'
import {
	formatCount,
	normalizePlanName,
	normalizeSubscriptionStatus
} from '../../utils/billingFormatters'
import CurrentPlanCard from '../CurrentPlanCard/CurrentPlanCard'
import InvoiceHistoryTable from '../InvoiceHistoryTable/InvoiceHistoryTable'
import UsageStatsCard from '../UsageStatsCard/UsageStatsCard'

type Props = {
	data: BillingResponse
}

export default function BillingContent({ data }: Props) {
	const usageMetrics = [
		{
			label: 'Создано ссылок',
			current: formatCount(data.usage.linksCreated),
			total: formatCount(data.usage.linksLimit),
			percentage:
				data.usage.linksLimit > 0
					? Math.min(
							100,
							Math.round(
								(data.usage.linksCreated /
									data.usage.linksLimit) *
									100
							)
						)
					: 0,
			variant: 'default' as const
		},
		{
			label: 'Всего кликов',
			current: formatCount(data.usage.clicksTotal),
			total: formatCount(data.usage.clicksLimit),
			percentage:
				data.usage.clicksLimit > 0
					? Math.min(
							100,
							Math.round(
								(data.usage.clicksTotal /
									data.usage.clicksLimit) *
									100
							)
						)
					: 0,
			variant: 'alt' as const
		}
	]

	const invoices = data.invoices.length ? data.invoices : demoInvoices
	const isDemo = !data.invoices.length

	return (
		<>
			<div className={styles.topGrid}>
				<CurrentPlanCard
					planName={normalizePlanName(data.plan.id, data.plan.name)}
					status={normalizeSubscriptionStatus(data.plan.status)}
				/>
				<UsageStatsCard metrics={usageMetrics} />
			</div>

			<InvoiceHistoryTable
				invoices={invoices}
				isDemo={isDemo}
			/>
		</>
	)
}
