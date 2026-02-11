import styles from '@/app/(auth)/AuthShared.module.scss'
import AuthLogo from '@/app/features/auth/components/AuthLogo/AuthLogo'
import BackToHomeLink from '@/app/features/auth/components/BackToHomeLink/BackToHomeLink'
import { ReactNode } from 'react'

interface AuthPageLayoutProps {
	isBackButton?: boolean
	children: ReactNode
}

export default function AuthPageLayout({
	isBackButton = true,
	children
}: AuthPageLayoutProps) {
	return (
		<div className={styles.page}>
			<div className={styles.pageContent}>
				<AuthLogo />
				{isBackButton && <BackToHomeLink />}
				{children}
			</div>
		</div>
	)
}
