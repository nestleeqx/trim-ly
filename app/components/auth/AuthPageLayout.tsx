import { ReactNode } from 'react'
import { AuthLogo } from './AuthLogo'
import { BackToHomeLink } from './BackToHomeLink'
import styles from './AuthShared.module.scss'

interface AuthPageLayoutProps {
	children: ReactNode
}

export const AuthPageLayout: React.FC<AuthPageLayoutProps> = ({
	children
}) => {
	return (
		<div className={styles.page}>
			<AuthLogo />
			{children}
			<BackToHomeLink />
		</div>
	)
}
