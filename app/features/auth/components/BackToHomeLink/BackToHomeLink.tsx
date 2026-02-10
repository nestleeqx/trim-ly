import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import styles from './BackToHomeLink.module.scss'

export default function BackToHomeLink() {
	return (
		<Link
			href='/'
			className={styles.backLink}
		>
			<ArrowLeft size={16} />
			Вернуться на главную
		</Link>
	)
}
