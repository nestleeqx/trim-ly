import Link from 'next/link'
import { footerSections } from '../footer.config'
import styles from '../Footer.module.scss'

interface FooterLinksProps {
	onContactClick?: () => void
}

export default function FooterLinks({ onContactClick }: FooterLinksProps) {
	return (
		<div className={styles.links}>
			{Object.entries(footerSections).map(([key, section]) => (
				<div
					key={key}
					className={styles.column}
				>
					<h3>{section.title}</h3>
					<ul>
						{section.links.map(link => (
							<li key={link.label}>
								{link.isModal ? (
									<button
										className={styles.linkButton}
										onClick={onContactClick}
									>
										{link.label}
									</button>
								) : (
									<Link
										href={link.href}
										className={styles.link}
									>
										{link.label}
									</Link>
								)}
							</li>
						))}
					</ul>
				</div>
			))}
		</div>
	)
}
