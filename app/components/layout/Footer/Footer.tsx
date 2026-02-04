'use client'
import { Github, Linkedin } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import ContactForm from '../../ui/ContactForm'
import Logo from '../../ui/Logo'
import Modal from '../../ui/Modal'
import styles from './Footer.module.scss'

const footerLinks = {
	product: {
		title: 'Продукт',
		links: [
			{ label: 'Возможности', href: '#features' },
			{ label: 'Тарифы', href: '#pricing' },
			{ label: 'История изменений', href: '#' },
			{ label: 'Расширения', href: '#' }
		]
	},
	company: {
		title: 'Компания',
		links: [
			{ label: 'О нас', href: '#' },
			{ label: 'Блог', href: '#' },
			{ label: 'Карьера', href: '#' },
			{ label: 'Контакты', href: '#', isModal: true }
		]
	},
	support: {
		title: 'Поддержка',
		links: [
			{ label: 'Центр помощи', href: '#' },
			{ label: 'API Документация', href: '#' },
			{ label: 'Статус', href: '#' },
			{ label: 'Сообщество', href: '#' }
		]
	},
	legal: {
		title: 'Правовая информация',
		links: [
			{ label: 'Политика конфиденциальности', href: '#' },
			{ label: 'Условия использования', href: '#' },
			{ label: 'Cookies', href: '#' }
		]
	}
}

export default function Footer() {
	const [isContactModalOpen, setContactModalOpen] = useState(false)

	return (
		<footer className={styles.footer}>
			<div className='container'>
				<div className={styles.content}>
					<div className={styles.brand}>
						<div className={styles.logo}>
							<Logo />
						</div>
						<p className={styles.description}>
							Профессиональный способ сокращать, отслеживать и
							управлять вашими ссылками и метриками роста.
						</p>
						<div className={styles.socials}>
							<a
								href='https://github.com/nestleeqx'
								target='_blank'
								rel='noopener noreferrer'
								aria-label='GitHub'
							>
								<Github size={20} />
							</a>
							<a
								href='https://linkedin.com'
								target='_blank'
								rel='noopener noreferrer'
								aria-label='LinkedIn'
							>
								<Linkedin size={20} />
							</a>
						</div>
					</div>
					<div className={styles.links}>
						{Object.entries(footerLinks).map(([key, section]) => (
							<div
								key={key}
								className={styles.column}
							>
								<h3 className={styles.columnTitle}>
									{section.title}
								</h3>
								<ul>
									{section.links.map(link => (
										<li key={link.label}>
											{link.isModal ? (
												<button
													className={
														styles.linkButton
													}
													onClick={() =>
														setContactModalOpen(
															true
														)
													}
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
				</div>
				<div className={styles.bottom}>
					<p className={styles.copyright}>
						© {new Date().getFullYear()} ShortStack Inc. Все права
						защищены.
					</p>
					<div className={styles.bottomLinks}>
						<Link href='#'>Безопасность</Link>
						<Link href='#'>Карта сайта</Link>
						<span className={styles.language}>Русский (RU)</span>
					</div>
				</div>
			</div>
			<Modal
				isOpen={isContactModalOpen}
				onClose={() => setContactModalOpen(false)}
				title='Связаться с нами'
			>
				<ContactForm />
			</Modal>
		</footer>
	)
}
