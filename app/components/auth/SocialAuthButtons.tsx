import Button from '@/app/components/ui/Button'
import { Github } from 'lucide-react'
import { GoogleIcon } from './GoogleIcon'
import styles from './AuthShared.module.scss'

export const SocialAuthButtons: React.FC = () => {
	return (
		<div className={styles.socialButtons}>
			<Button
				variant='ghost'
				className={styles.socialBtn}
			>
				<GoogleIcon className={styles.socialIcon} />
				Google
			</Button>
			<Button
				variant='ghost'
				className={styles.socialBtn}
			>
				<Github size={18} />
				GitHub
			</Button>
		</div>
	)
}
