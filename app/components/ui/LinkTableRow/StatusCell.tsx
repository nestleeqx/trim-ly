'use client'

import { LinkStatus } from '@/types/links'
import { getStatusLabel } from '@/utils/link-helpers'
import React from 'react'
import { getStatusClass } from '../LinksTable/shared'
import sharedStyles from '../LinksTable/shared.module.scss'

interface StatusCellProps {
	status: LinkStatus
}

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
