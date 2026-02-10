import { Link as LinkIcon } from 'lucide-react'
import styles from './AuthLogo.module.scss'

export default function AuthLogo() {
	return (
		<div className={styles.logo}>
			<div className={styles.logoIcon}>
				<LinkIcon size={24} />
			</div>
			<span className={styles.logoText}>trim.ly</span>
		</div>
	)
}
