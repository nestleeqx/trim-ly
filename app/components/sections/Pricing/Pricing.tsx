'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import Button from '../../ui/Button'
import ContactForm from '../../ui/ContactForm'
import Modal from '../../ui/Modal'
import styles from './Pricing.module.scss'

interface PlanFeature {
	text: string
}

interface Plan {
	name: string
	monthlyPrice: string
	yearlyPrice: string
	description: string
	features: PlanFeature[]
	buttonText: string
	buttonVariant: 'primary' | 'outline' | 'ghost'
	popular?: boolean
	href: string
	isContact?: boolean
	discount?: string
}

const Pricing: React.FC = () => {
	const [isContactModalOpen, setContactModalOpen] = useState(false)
	const [isYearly, setIsYearly] = useState(false)

	const plans: Plan[] = [
		{
			name: 'Бесплатный',
			monthlyPrice: '0',
			yearlyPrice: '0',
			description: 'Идеально для старта и личного использования.',
			features: [
				{ text: '50 ссылок / месяц' },
				{ text: 'Базовая аналитика' },
				{ text: 'Статичные QR-коды' },
				{ text: 'Link-in-bio (Стандарт)' }
			],
			buttonText: 'Начать бесплатно',
			buttonVariant: 'outline',
			href: '/signup'
		},
		{
			name: 'Pro',
			monthlyPrice: '950',
			yearlyPrice: '9 500',
			description: 'Всё для развития вашего бренда.',
			features: [
				{ text: 'Безлимитные ссылки' },
				{ text: 'Расширенная аналитика' },
				{ text: 'Брендированные домены' },
				{ text: 'Динамические QR-коды' },
				{ text: 'Link-in-bio (Pro)' }
			],
			buttonText: 'Перейти на Pro',
			buttonVariant: 'primary',
			popular: true,
			href: '/signup?plan=pro',
			discount: 'Экономия 1 900 ₽'
		},
		{
			name: 'Команда',
			monthlyPrice: '3 400',
			yearlyPrice: '34 000',
			description: 'Масштабируйтесь с расширенными возможностями.',
			features: [
				{ text: 'Множество воркспейсов' },
				{ text: 'Командная работа' },
				{ text: 'API доступ' },
				{ text: 'Приоритетная поддержка' },
				{ text: 'SAML SSO' }
			],
			buttonText: 'Связаться с нами',
			buttonVariant: 'outline',
			href: '/contact',
			isContact: true,
			discount: 'Экономия 6 800 ₽'
		}
	]

	return (
		<section
			className={styles.pricing}
			id='pricing'
		>
			<div className='container'>
				<motion.div
					className={styles.header}
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.5 }}
					transition={{ duration: 0.5 }}
				>
					<h2 className={styles.title}>Простые тарифы</h2>
					<p className={styles.subtitle}>
						Выберите план, который подходит для вашего роста.
					</p>

					<div className={styles.toggleContainer}>
						<div className={styles.toggleWrapper}>
							<button
								className={`${styles.toggleOption} ${!isYearly ? styles.active : ''}`}
								onClick={() => setIsYearly(false)}
							>
								Ежемесячно
							</button>
							<button
								className={`${styles.toggleOption} ${isYearly ? styles.active : ''}`}
								onClick={() => setIsYearly(true)}
							>
								Ежегодно
							</button>
							<div
								className={`${styles.toggleSlider} ${isYearly ? styles.right : styles.left}`}
							/>
						</div>
						{isYearly && (
							<span className={styles.saveBadge}>
								Скидка до 20%
							</span>
						)}
					</div>
				</motion.div>

				<div className={styles.grid}>
					{plans.map((plan, index) => (
						<motion.div
							key={plan.name}
							className={`${styles.card} ${plan.popular ? styles.popular : ''}`}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.2 }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							whileHover={{ y: -5, transition: { duration: 0.2 } }}
						>
							{plan.popular && (
								<span className={styles.badge}>ПОПУЛЯРНЫЙ</span>
							)}
							<div className={styles.cardHeader}>
								<h3 className={styles.planName}>{plan.name}</h3>
								<div className={styles.priceWrapper}>
									<span className={styles.price}>
										{isYearly
											? plan.yearlyPrice
											: plan.monthlyPrice}
									</span>
									<span className={styles.currency}>₽</span>
									<span className={styles.period}>
										{isYearly ? '/год' : '/месяц'}
									</span>
								</div>
								{isYearly && plan.discount && (
									<span className={styles.discount}>
										{plan.discount}
									</span>
								)}
								<p className={styles.planDescription}>
									{plan.description}
								</p>
							</div>
							<ul className={styles.features}>
								{plan.features.map((feature, index) => (
									<li
										key={index}
										className={styles.feature}
									>
										<Check
											size={18}
											className={styles.checkIcon}
										/>
										<span>{feature.text}</span>
									</li>
								))}
							</ul>
							<div className={styles.cardFooter}>
								{plan.isContact ? (
									<div className={styles.buttonLink}>
										<Button
											variant={plan.buttonVariant}
											size='lg'
											onClick={() =>
												setContactModalOpen(true)
											}
										>
											{plan.buttonText}
										</Button>
									</div>
								) : (
									<Link
										href={plan.href}
										className={styles.buttonLink}
									>
										<Button
											variant={plan.buttonVariant}
											size='lg'
										>
											{plan.buttonText}
										</Button>
									</Link>
								)}
							</div>
						</motion.div>
					))}
				</div>
			</div>

			<Modal
				isOpen={isContactModalOpen}
				onClose={() => setContactModalOpen(false)}
				title='Связаться с отделом продаж'
			>
				<ContactForm />
			</Modal>
		</section>
	)
}

export default Pricing
