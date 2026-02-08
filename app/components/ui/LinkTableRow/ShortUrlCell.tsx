'use client'

import { ExternalLink } from 'lucide-react'
import React from 'react'
import sharedStyles from '../LinksTable/shared.module.scss'

interface ShortUrlCellProps {
	shortUrl: string
}

/**
 * ShortUrlCell - рендерит ячейку с коротким URL и ссылкой
 */
export const ShortUrlCell: React.FC<ShortUrlCellProps> = ({ shortUrl }) => {
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
