'use client'

import {
	AlertTriangle,
	Clock,
	Eye,
	EyeOff,
	Link2Off,
	Link as LinkIcon,
	Lock,
	Pause,
	ShieldCheck
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import Button from '../components/ui/Button'
import styles from './page.module.scss'

type LinkState =
	| 'redirecting'
	| 'password'
	| 'paused'
	| 'expired'
	| 'not-found'
	| 'error'

const MOCK_LINKS: Record<string, { state: LinkState; destination: string }> = {
	'demo-redirect': {
		state: 'redirecting',
		destination: 'https://store.apple.com/shop/goto/iphone15pro'
	},
	'demo-password': {
		state: 'password',
		destination: 'https://example.com/secret'
	},
	'demo-paused': {
		state: 'paused',
		destination: 'https://example.com/paused'
	},
	'demo-expired': {
		state: 'expired',
		destination: 'https://example.com/expired'
	},
	'demo-not-found': {
		state: 'not-found',
		destination: ''
	},
	'demo-error': {
		state: 'error',
		destination: 'https://example.com/error'
	}
}

function RedirectingState({ destination }: { destination: string }) {
	return (
		<div className={styles.card}>
			<div className={styles.spinner} />

			<h1 className={styles.cardTitle}>Перенаправляем вас...</h1>
			<p className={styles.cardSubtitle}>
				Переходим по ссылке назначения.
			</p>

			<div className={styles.urlBox}>
				<span className={styles.urlText}>{destination}</span>
			</div>

			<a
				href={destination}
				className={styles.fallbackLink}
			>
				Нажмите здесь, если ничего не происходит
			</a>
		</div>
	)
}

function PasswordState() {
	const [password, setPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)

	const togglePassword = useCallback(() => {
		setShowPassword(prev => !prev)
	}, [])

	const handleSubmit = useCallback((e: React.FormEvent) => {
		e.preventDefault()
	}, [])

	return (
		<div className={styles.card}>
			<div className={`${styles.stateIcon} ${styles.stateIconPurple}`}>
				<Lock size={24} />
			</div>

			<h1 className={styles.cardTitle}>Ссылка защищена</h1>
			<p className={styles.cardSubtitle}>
				Введите пароль для продолжения.
			</p>

			<form
				className={styles.form}
				onSubmit={handleSubmit}
			>
				<div className={styles.inputWrapper}>
					<input
						type={showPassword ? 'text' : 'password'}
						className={styles.input}
						placeholder='••••••••'
						value={password}
						onChange={e => setPassword(e.target.value)}
						autoComplete='off'
					/>
					<button
						type='button'
						className={styles.passwordToggle}
						onClick={togglePassword}
						aria-label={
							showPassword ? 'Скрыть пароль' : 'Показать пароль'
						}
					>
						{showPassword ? (
							<EyeOff size={18} />
						) : (
							<Eye size={18} />
						)}
					</button>
				</div>

				<Button
					variant='primary'
					type='submit'
					size='lg'
				>
					Разблокировать ссылку
				</Button>
			</form>

			<Link
				href='/'
				className={styles.goBackLink}
			>
				Назад
			</Link>
		</div>
	)
}

function PausedState() {
	return (
		<div className={styles.card}>
			<div className={`${styles.stateIcon} ${styles.stateIconOrange}`}>
				<Pause size={24} />
			</div>

			<h1 className={styles.cardTitle}>Временно отключена</h1>
			<p className={styles.cardSubtitle}>
				Владелец приостановил эту ссылку. Попробуйте позже.
			</p>

			<Link
				href='/'
				className={styles.darkBtn}
			>
				<Button
					variant='primary'
					size='lg'
				>
					На главную
				</Button>
			</Link>
		</div>
	)
}

function ExpiredState() {
	return (
		<div className={styles.card}>
			<div className={`${styles.stateIcon} ${styles.stateIconGray}`}>
				<Clock size={24} />
			</div>

			<h1 className={styles.cardTitle}>Ссылка устарела</h1>
			<p className={styles.cardSubtitle}>
				Владелец установил срок действия для этой ссылки, который истёк.
			</p>

			<Link
				href='/'
				className={styles.darkBtn}
			>
				<Button
					variant='primary'
					size='lg'
				>
					На главную
				</Button>
			</Link>
		</div>
	)
}

function NotFoundState() {
	return (
		<div className={styles.card}>
			<div className={`${styles.stateIcon} ${styles.stateIconRed}`}>
				<Link2Off size={24} />
			</div>

			<h1 className={styles.cardTitle}>Ссылка не существует</h1>
			<p className={styles.cardSubtitle}>
				Возможно, она была удалена, срок действия истёк, или вы ошиблись
				в URL.
			</p>

			<Link
				href='/'
				className={styles.primaryBtn}
			>
				<Button
					variant='primary'
					size='lg'
				>
					На главную
				</Button>
			</Link>
		</div>
	)
}

function ErrorState() {
	return (
		<div className={styles.card}>
			<div className={`${styles.stateIcon} ${styles.stateIconRed}`}>
				<AlertTriangle size={24} />
			</div>

			<h1 className={styles.cardTitle}>Что-то пошло не так</h1>
			<p className={styles.cardSubtitle}>
				Не удалось перенаправить вас из-за ошибки сервера.
			</p>

			<div className={styles.buttonGroup}>
				<Button
					variant='primary'
					size='lg'
					onClick={() => window.location.reload()}
				>
					Попробовать снова
				</Button>
				<Link
					href='/'
					className={styles.outlineBtn}
				>
					<Button
						variant='ghost'
						size='lg'
					>
						На главную
					</Button>
				</Link>
			</div>
		</div>
	)
}

export default function SlugPage() {
	const params = useParams()
	const slug = params.slug as string

	const linkData = MOCK_LINKS[slug] ?? {
		state: 'redirecting' as LinkState,
		destination: 'https://example.com/destination'
	}

	return (
		<div className={styles.page}>
			{/* Logo */}
			<div className={styles.logo}>
				<div className={styles.logoIcon}>
					<LinkIcon size={20} />
				</div>
				<span className={styles.logoText}>trim.ly</span>
			</div>

			{/* Content */}
			{linkData.state === 'redirecting' && (
				<RedirectingState destination={linkData.destination} />
			)}
			{linkData.state === 'password' && <PasswordState />}
			{linkData.state === 'paused' && <PausedState />}
			{linkData.state === 'expired' && <ExpiredState />}
			{linkData.state === 'not-found' && <NotFoundState />}
			{linkData.state === 'error' && <ErrorState />}

			{/* Footer */}
			<div className={styles.footer}>
				<ShieldCheck size={14} />
				<span>Защищено trim.ly</span>
			</div>
		</div>
	)
}
