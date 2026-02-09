import { Link as LinkIcon } from 'lucide-react'
import styles from './AuthShared.module.scss'

export const AuthLogo: React.FC = () => {
	return (
		<div className={styles.logo}>
			<div className={styles.logoIcon}>
				<LinkIcon size={24} />
			</div>
			<span className={styles.logoText}>trim.ly</span>
		</div>
	)
}
