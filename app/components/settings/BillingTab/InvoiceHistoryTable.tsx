import { Invoice } from './billing.config'
import styles from './BillingTab.module.scss'

interface InvoiceHistoryTableProps {
	invoices: Invoice[]
}

export const InvoiceHistoryTable: React.FC<InvoiceHistoryTableProps> = ({
	invoices
}) => {
	return (
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
							<td className={styles.colAmount}>{inv.amount}</td>
							<td className={styles.colStatus}>
								<span className={styles.paid}>✓ {inv.status}</span>
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
	)
}
