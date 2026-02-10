'use client'

import sharedStyles from '../shared.module.scss'
import ActionsCell from './ActionsCell'
import ClicksCell from './ClicksCell'
import DateCell from './DateCell'
import styles from './LinkTableRow.module.scss'
import ShortUrlCell from './ShortUrlCell'
import StatusCell from './StatusCell'
import TitleCell from './TitleCell'
import TrendCell from './TrendCell'
import { LinkTableRowProps } from './types'

export default function LinkTableRow({
	link,
	isSelected,
	onSelectLink,
	allowSelection = true,
	showActions = true,
	showTrend = true,
	openKebabId,
	actions
}: LinkTableRowProps) {
	const kebabActions = {
		closeKebabMenu: actions.closeKebabMenu,
		handleEdit: actions.handleEdit,
		handleToggleStatus: actions.handleToggleStatus,
		handleDelete: actions.handleDelete
	}

	return (
		<tr
			className={`${styles.row} ${isSelected ? styles.selected : ''}`}
			onClick={e => actions.handleItemClick(e)}
		>
			{allowSelection ? (
				<td className={styles.checkboxCell}>
					<input
						type='checkbox'
						checked={!!isSelected}
						onChange={e =>
							onSelectLink?.(link.id, e.target.checked)
						}
						className={sharedStyles.checkbox}
						aria-label={`Выбрать ${link.title}`}
					/>
				</td>
			) : null}
			<TitleCell
				title={link.title}
				onTitleClick={e => actions.handleTitleClick(link.id, e)}
			/>
			<ShortUrlCell shortUrl={link.shortUrl} />
			<ClicksCell clicks={link.clicks} />
			{showTrend ? <TrendCell clicks={link.clicks} /> : null}
			<StatusCell status={link.status} />
			<DateCell date={link.createdAt} />
			{showActions ? (
				<ActionsCell
					link={link}
					openKebabId={openKebabId}
					onCopy={actions.handleCopy}
					onQrClick={actions.handleQrClick}
					onAnalyticsClick={actions.handleAnalyticsClick}
					onKebabClick={actions.handleKebabClick}
					kebabActions={kebabActions}
				/>
			) : null}
		</tr>
	)
}
