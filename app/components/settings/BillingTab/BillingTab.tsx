import Button from '../../ui/Button'
import TabCard from '../TabCard/TabCard'
import styles from './BillingTab.module.scss'

const invoices = [
	{
		id: 'INV-2024-001',
		date: '01 окт. 2024',
		amount: '$0.00',
		status: 'Оплачено'
	},
	{
		id: 'INV-2024-002',
		date: '01 сен. 2024',
		amount: '$0.00',
		status: 'Оплачено'
	}
]

export default function BillingTab() {
	return (
		<TabCard
			title='Оплата'
			subtitle='Управляйте подпиской и способами оплаты.'
		>
			<>
				<div className={styles.topGrid}>
					<div className={styles.planCard}>
						<div>
							<div className={styles.planHeader}>
								<div>
									<div className={styles.planLabel}>
										ТЕКУЩИЙ ПЛАН
									</div>
									<h3 className={styles.planTitle}>
										Бесплатный план
									</h3>
								</div>
								<div className={styles.badge}>ACTIVE</div>
							</div>
							<p className={styles.planDesc}>
								Ваш бесплатный доступ постоянный. Обновитесь,
								чтобы открыть расширенные функции, такие как
								собственные домены и командная работа.
							</p>
						</div>

						<div className={styles.planAction}>
							<Button variant='primary'>Обновить до PRO</Button>
						</div>
					</div>

					<div className={styles.usageCard}>
						<div className={styles.usageRow}>
							<div className={styles.usageLabel}>
								Создано ссылок
							</div>
							<div className={styles.usageValue}>
								6,500 / 10,000
							</div>
						</div>
						<div className={styles.progressBar}>
							<div
								className={styles.progressFill}
								style={{ width: '65%' }}
							/>
						</div>

						<div className={styles.usageRow}>
							<div className={styles.usageLabel}>
								Всего кликов
							</div>
							<div className={styles.usageValue}>42.8k / 50k</div>
						</div>
						<div
							className={`${styles.progressBar} ${styles.progressAlt}`}
						>
							<div
								className={styles.progressFillAlt}
								style={{ width: '85%' }}
							/>
						</div>
					</div>
				</div>

				<div className={styles.historyCard}>
					<h4 className={styles.historyTitle}>История платежей</h4>

					<table className={styles.invoiceTable}>
						<thead>
							<tr>
								<th>ID СЧЕТА</th>
								<th>ДАТА</th>
								<th>СУММА</th>
								<th>СТАТУС</th>
								<th>КВИТАНЦИЯ</th>
							</tr>
						</thead>
						<tbody>
							{invoices.map(inv => (
								<tr key={inv.id}>
									<td className={styles.colId}>{inv.id}</td>
									<td>{inv.date}</td>
									<td className={styles.colAmount}>
										{inv.amount}
									</td>
									<td className={styles.colStatus}>
										<span className={styles.paid}>
											✓ {inv.status}
										</span>
									</td>
									<td className={styles.colReceipt}>
										<a
											className={styles.download}
											href='#'
										>
											Скачать
										</a>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</>
		</TabCard>
	)
}
