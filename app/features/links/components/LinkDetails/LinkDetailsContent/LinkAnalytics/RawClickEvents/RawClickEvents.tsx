'use client'

import Button from '@/app/components/ui/Button/Button'
import LoadingOverlay from '@/app/components/ui/LoadingOverlay/LoadingOverlay'
import Pagination from '@/app/components/ui/Pagination/Pagination'
import { toShortLinkHref } from '@/app/features/links/utils/shortLink'
import { usePagination } from '@/hooks/usePagination'
import { ClickEvent } from '@/types/links'
import { convertClickEventsToCsv } from '@/utils/csvConverters'
import { downloadCsv } from '@/utils/downloadCsv'
import cn from 'classnames'
import styles from './RawClickEvents.module.scss'

interface RawClickEventsProps {
	events: ClickEvent[]
	isLoading?: boolean
}

export default function RawClickEvents({
	events,
	isLoading = false
}: RawClickEventsProps) {
	const {
		currentPage,
		itemsPerPage,
		totalItems,
		totalPages,
		paginatedData,
		handlePageChange,
		handleItemsPerPageChange
	} = usePagination({ data: events })

	const handleDownloadCsv = () => {
		downloadCsv({
			data: events,
			filename: `click_events_${new Date().toISOString().slice(0, 10)}.csv`,
			converter: convertClickEventsToCsv
		})
	}

	return (
		<>
			<div className={styles.card}>
				<div className={styles.header}>
					<h3 className={styles.title}>Сырые события</h3>
					<Button
						variant='ghost'
						size='sm'
						onClick={handleDownloadCsv}
						disabled={isLoading || events.length === 0}
						aria-label='Скачать CSV'
					>
						Скачать CSV
					</Button>
				</div>
				<div
					className={cn(styles.tableWrapper, {
						[styles.loading]: isLoading
					})}
				>
					<table className={styles.table}>
						<thead>
							<tr>
								<th>Время</th>
								<th>Страна</th>
								<th>Устройство</th>
								<th>Браузер</th>
								<th>Источник</th>
							</tr>
						</thead>
						<tbody>
							{paginatedData.length > 0 ? (
								paginatedData.map((event, idx) => (
									<tr key={`${event.time}-${idx}`}>
										<td>{event.time}</td>
										<td>{event.country.name}</td>
										<td>{event.device.name}</td>
										<td>{event.browser}</td>
										<td>
											{event.referrer === 'direct' ? (
												<span
													className={styles.referrer}
												>
													{event.referrer}
												</span>
											) : (
												<a
													href={toShortLinkHref(
														event.referrer
													)}
													className={styles.referrer}
													target='_blank'
													rel='noopener noreferrer'
												>
													{event.referrer}
												</a>
											)}
										</td>
									</tr>
								))
							) : (
								<tr>
									<td
										className={styles.empty}
										colSpan={5}
									>
										Нет событий за выбранный период.
									</td>
								</tr>
							)}
						</tbody>
					</table>
					{isLoading ? <LoadingOverlay /> : null}
				</div>
			</div>
			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				totalItems={totalItems}
				itemsPerPage={itemsPerPage}
				onPageChange={handlePageChange}
				onItemsPerPageChange={handleItemsPerPageChange}
			/>
		</>
	)
}
