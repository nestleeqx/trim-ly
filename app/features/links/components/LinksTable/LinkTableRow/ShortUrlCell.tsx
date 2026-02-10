'use client'

import { ExternalLink } from 'lucide-react'
import sharedStyles from '../shared.module.scss'

interface ShortUrlCellProps {
	shortUrl: string
}

export default function ShortUrlCell({ shortUrl }: ShortUrlCellProps) {
	return (
		<td>
			<a
				href={`https://${shortUrl}`}
				target='_blank'
				rel='noopener noreferrer'
				className={sharedStyles.shortUrlLink}
			>
				<span className={sharedStyles.shortUrl}>{shortUrl}</span>
				<ExternalLink
					size={14}
					className={sharedStyles.externalIcon}
				/>
			</a>
		</td>
	)
}
