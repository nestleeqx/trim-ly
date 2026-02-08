'use client'

import { getStatusLabel } from '@/app/utils/link-helpers'
import { LinkStatus } from '@/types/links'
import React from 'react'
import { getStatusClass } from '../LinksTable/shared'
import sharedStyles from '../LinksTable/shared.module.scss'

interface StatusCellProps {
	status: LinkStatus
}

/**
 * StatusCell - рендерит ячейку статуса ссылки
 */
export const StatusCell: React.FC<StatusCellProps> = ({ status }) => {
	return (
		<td>
			<span
				className={`${sharedStyles.status} ${getStatusClass(status)}`}
			>
				{getStatusLabel(status)}
			</span>
		</td>
	)
}
