import styles from '../../BillingTab.module.scss'

interface Invoice {
	id: string
	date: string
	amount: string
	status: string
	receiptUrl?: string
}

interface InvoiceHistoryTableProps {
	invoices: Invoice[]
	isDemo?: boolean
}

export default function InvoiceHistoryTable({
	invoices,
	isDemo = false
}: InvoiceHistoryTableProps) {
	return (
		<div className={styles.historyCard}>
			<h4 className={styles.historyTitle}>История платежей</h4>
			{isDemo && <span className={styles.demoBadge}>Демо данные</span>}
			<div className={styles.invoiceTableWrap}>
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
								<td className={styles.colAmount}>{inv.amount}</td>
								<td className={styles.colStatus}>
									<span className={styles.paid}>✓ {inv.status}</span>
								</td>
								<td className={styles.colReceipt}>
									{inv.receiptUrl ? (
										<a
											className={styles.download}
											href={inv.receiptUrl}
											target='_blank'
											rel='noreferrer'
										>
											Скачать
										</a>
									) : (
										<span className={styles.planDesc}>—</span>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}
