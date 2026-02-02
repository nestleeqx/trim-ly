import { Link as LinkIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import styles from './Logo.module.scss'

const Logo: React.FC = () => {
	return (
		<Link
			href='/'
			className={styles.logo}
		>
			<div className={styles.iconWrapper}>
				<LinkIcon size={20} />
			</div>
			<span className={styles.text}>trim.ly</span>
		</Link>
	)
}

export default Logo
