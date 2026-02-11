import Button from '@/app/components/ui/Button/Button'
import { signIn } from 'next-auth/react'
import styles from './SocialAuthButtons.module.scss'

export default function SocialAuthButtons() {
	return (
		<div className={styles.socialButtons}>
			<Button
				variant='ghost'
				className={styles.socialBtn}
				aria-label='Продолжить с Google'
				title='Продолжить с Google'
				onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
			>
				<svg
					className={styles.socialIcon}
					viewBox='0 0 24 24'
				>
					<path
						d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z'
						fill='#4285F4'
					/>
					<path
						d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
						fill='#34A853'
					/>
					<path
						d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
						fill='#FBBC05'
					/>
					<path
						d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
						fill='#EA4335'
					/>
				</svg>
				Google
			</Button>
			<Button
				variant='ghost'
				className={styles.socialBtn}
				aria-label='Продолжить с Яндекс'
				title='Продолжить с Яндекс'
				onClick={() => signIn('yandex', { callbackUrl: '/dashboard' })}
			>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					width='24'
					height='24'
					fill='none'
				>
					<path
						d='M2.04 12c0-5.523 4.476-10 10-10 5.522 0 10 4.477 10 10s-4.478 10-10 10c-5.524 0-10-4.477-10-10z'
						fill='#FC3F1D'
					/>
					<path
						d='M13.32 7.666h-.924c-1.694 0-2.585.858-2.585 2.123 0 1.43.616 2.1 1.881 2.959l1.045.704-3.003 4.487H7.49l2.695-4.014c-1.55-1.111-2.42-2.19-2.42-4.015 0-2.288 1.595-3.85 4.62-3.85h3.003v11.868H13.32V7.666z'
						fill='#fff'
					/>
				</svg>
				Яндекс
			</Button>
		</div>
	)
}
