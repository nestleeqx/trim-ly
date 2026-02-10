import styles from '@/app/(auth)/AuthShared.module.scss'
import AuthLogo from '@/app/features/auth/components/AuthLogo/AuthLogo'
import BackToHomeLink from '@/app/features/auth/components/BackToHomeLink/BackToHomeLink'
import { ReactNode } from 'react'

interface AuthPageLayoutProps {
	children: ReactNode
}

export default function AuthPageLayout({ children }: AuthPageLayoutProps) {
	return (
		<div className={styles.page}>
			<AuthLogo />
			{children}
			<BackToHomeLink />
		</div>
	)
}
