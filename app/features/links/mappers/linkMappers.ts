import { getLinks } from '@/app/features/links/api/linksApi'
import { LinkItem } from '@/types/links'

type LinkDto = Awaited<ReturnType<typeof getLinks>>['links'][number]

export function mapLinkDtoToItem(link: LinkDto): LinkItem {
	return {
		id: link.id,
		title: link.title,
		shortUrl: link.shortUrl,
		destination: link.destination,
		clicks: link.clicks,
		status: link.status,
		tags: link.tags,
		createdAt: new Date(link.createdAt),
		expirationDate: link.expirationDate
			? new Date(link.expirationDate)
			: undefined,
		hasPassword: link.hasPassword
	}
}

