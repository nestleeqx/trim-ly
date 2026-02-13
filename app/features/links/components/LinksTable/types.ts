import { LinkItem as LinkItemType } from '@/types/links'

export interface LinksTableProps {
	links: LinkItemType[]
	selectedLinks: string[]
	onSelectAll: (checked: boolean) => void
	onSelectLink: (id: string, checked: boolean) => void
	onCopy?: (shortUrl: string) => void
	onDelete?: (id: string) => void
	onPause?: (id: string) => void
	onResume?: (id: string) => void
	onRestore?: (id: string) => void
	title?: string
	allLinksHref?: string
	allowSelection?: boolean
	showActions?: boolean
	showTrend?: boolean
}
