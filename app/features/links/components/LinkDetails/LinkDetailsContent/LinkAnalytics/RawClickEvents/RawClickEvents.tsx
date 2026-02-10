'use client'

import Button from '@/app/components/ui/Button/Button'
import Pagination from '@/app/components/ui/Pagination/Pagination'
import useCsvExport from '@/hooks/useCsvExport'
import { usePagination } from '@/hooks/usePagination'
import { ClickEvent } from '@/types/links'
import { convertClickEventsToCsv } from '@/utils/csvConverters'
import styles from './RawClickEvents.module.scss'

interface RawClickEventsProps {
	events: ClickEvent[]
}

export default function RawClickEvents({ events }: RawClickEventsProps) {
	const { downloadCsv } = useCsvExport(
		events,
		'click_events',
		convertClickEventsToCsv
	)

	const {
		currentPage,
		itemsPerPage,
		totalItems,
		totalPages,
		paginatedData,
		handlePageChange,
		handleItemsPerPageChange
	} = usePagination({ data: events })

	return (
		<div className={styles.card}>
			<div className={styles.header}>
				<h3 className={styles.title}>События кликов</h3>
				<Button
					variant='ghost'
					size='sm'
					onClick={() => downloadCsv()}
					aria-label='Экспорт CSV'
				>
					Экспорт CSV
				</Button>
			</div>
			<div className={styles.tableWrapper}>
				<table className={styles.table}>
					<thead>
						<tr>
							<th>ВРЕМЯ</th>
							<th>СТРАНА</th>
							<th>УСТРОЙСТВО</th>
							<th>БРАУЗЕР</th>
							<th>ИСТОЧНИК</th>
						</tr>
					</thead>
					<tbody>
						{paginatedData.map((e, idx) => (
							<tr key={`${e.time}-${idx}`}>
								<td>{e.time}</td>
								<td>
									<span className={styles.countryName}>
										{e.country.name}
									</span>
								</td>
								<td>{e.device.name}</td>
								<td>{e.browser}</td>
								<td>
									<a
										href={`https://${e.referrer}`}
										className={styles.referrer}
									>
										{e.referrer}
									</a>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className={styles.paginationWrapper}>
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					totalItems={totalItems}
					itemsPerPage={itemsPerPage}
					onPageChange={handlePageChange}
					onItemsPerPageChange={handleItemsPerPageChange}
				/>
			</div>
		</div>
	)
}
