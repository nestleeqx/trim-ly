import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import styles from './AuthShared.module.scss'

export const BackToHomeLink: React.FC = () => {
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
