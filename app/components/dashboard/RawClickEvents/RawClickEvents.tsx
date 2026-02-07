'use client'

import Pagination from '@/app/components/dashboard/Pagination/Pagination'
import useCsvExport from '@/hooks/useCsvExport'
import { ClickEvent } from '@/types/links'
import React, { useMemo, useState } from 'react'
import Button from '../../ui/Button'
import styles from './RawClickEvents.module.scss'

interface RawClickEventsProps {
	events: ClickEvent[]
}

const csvConverter = (data: ClickEvent[]) => {
	const headers = [
		'time',
		'country_code',
		'country_name',
		'device_type',
		'device_name',
		'browser',
		'referrer'
	]
	const escape = (v: any) => {
		if (v === null || v === undefined) return ''
		const s = String(v)
		if (s.includes(',') || s.includes('"') || s.includes('\n')) {
			return `"${s.replace(/"/g, '""')}"`
		}
		return s
	}

	const rows = data.map(evt => [
		evt.time,
		evt.country.code,
		evt.country.name,
		evt.device.type,
		evt.device.name,
		evt.browser,
		evt.referrer
	])

	return [
		headers.map(escape).join(','),
		...rows.map(r => r.map(escape).join(','))
	].join('\n')
}

const RawClickEvents: React.FC<RawClickEventsProps> = ({ events }) => {
	const { downloadCsv } = useCsvExport(events, 'click_events', csvConverter)

	const [currentPage, setCurrentPage] = useState(1)
	const [itemsPerPage, setItemsPerPage] = useState(10)

	const totalItems = events.length
	const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))

	// Ensure current page is within bounds when events or itemsPerPage change
	if (currentPage > totalPages) setCurrentPage(1)

	const paginatedEvents = useMemo(() => {
		const start = (currentPage - 1) * itemsPerPage
		return events.slice(start, start + itemsPerPage)
	}, [events, currentPage, itemsPerPage])

	return (
		<div className={styles.card}>
			<div className={styles.header}>
				<h3 className={styles.title}>Raw click events</h3>
				<Button
					variant='ghost'
					size='sm'
					onClick={() => downloadCsv()}
					aria-label='Export CSV'
				>
					Export CSV
				</Button>
			</div>
			<div>
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
						{paginatedEvents.map((e, idx) => (
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
					onPageChange={(p: number) => setCurrentPage(p)}
					onItemsPerPageChange={(c: number) => {
						setItemsPerPage(c)
						setCurrentPage(1)
					}}
				/>
			</div>
		</div>
	)
}

export default RawClickEvents
