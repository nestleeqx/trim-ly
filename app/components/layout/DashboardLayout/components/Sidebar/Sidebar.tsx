'use client'

import { useSidebar } from '@/hooks/useSidebar'
import SidebarShell from './components/SidebarShell'
import { useSidebarBilling } from './hooks/useSidebarBilling'

interface SidebarProps {
	usedLinks?: number
	maxLinks?: number
	planName?: string
}

export default function Sidebar({
	usedLinks = 0,
	maxLinks = 0,
	planName = 'Бесплатный план'
}: SidebarProps) {
	const { isOpen, close, toggle } = useSidebar()
	const resolved = useSidebarBilling({ usedLinks, maxLinks, planName })

	const isLimitReached =
		resolved.maxLinks > 0 && resolved.usedLinks >= resolved.maxLinks

	return (
		<SidebarShell
			isOpen={isOpen}
			onClose={close}
			onToggle={toggle}
			usedLinks={resolved.usedLinks}
			maxLinks={resolved.maxLinks}
			planName={resolved.planName}
			isLimitReached={isLimitReached}
		/>
	)
}
