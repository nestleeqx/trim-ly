import Link from 'next/link'
import { bottomLinks } from './footer.config'
import styles from './Footer.module.scss'

export default function FooterBottom() {
	const currentYear = new Date().getFullYear()

	return (
		<div className={styles.bottom}>
			<p className={styles.copyright}>
				© {currentYear} Trim.ly Inc. Все права защищены.
			</p>
			<div className={styles.bottomLinks}>
				{bottomLinks.map(link => (
					<Link
						key={link.label}
						href={link.href}
					>
						{link.label}
					</Link>
				))}
				<span className={styles.language}>Русский (RU)</span>
			</div>
		</div>
	)
}
