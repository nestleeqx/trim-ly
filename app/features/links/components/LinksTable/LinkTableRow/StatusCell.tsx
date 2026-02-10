'use client'

import { LinkStatus } from '@/types/links'
import { getStatusLabel } from '@/utils/link-helpers'
import { getStatusClass } from '../shared'
import sharedStyles from '../shared.module.scss'

interface StatusCellProps {
	status: LinkStatus
}

export default function StatusCell({ status }: StatusCellProps) {
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
