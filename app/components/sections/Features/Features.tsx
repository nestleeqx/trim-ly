'use client'

import { motion } from 'framer-motion'
import { BarChart3, Link2, QrCode, User } from 'lucide-react'
import React from 'react'
import styles from './Features.module.scss'

const Features: React.FC = () => {
	const features = [
		{
			icon: Link2,
			title: 'Брендированные ссылки',
			description:
				'Кастомные алиасы, чистые URL и опциональные брендированные домены для доверия аудитории.',
			href: '#links',
			color: '#60a5fa'
		},
		{
			icon: BarChart3,
			title: 'Аналитика в реальном времени',
			description:
				'Глубокая аналитика кликов, источников, стран и устройств для оптимизации эффективности.',
			href: '#analytics',
			color: '#818cf8'
		},
		{
			icon: QrCode,
			title: 'QR-коды',
			description:
				'Генерируйте настраиваемые QR-коды для любой ссылки. Скачивайте в форматах SVG/PNG.',
			href: '#qr',
			color: '#a78bfa'
		},
		{
			icon: User,
			title: 'Страница link-in-bio',
			description:
				'Красивая мобильная страница для всех ваших ссылок. Полностью настраиваемая тема.',
			href: '#bio',
			color: '#c084fc'
		}
	]

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1
			}
		}
	} as const

	const cardVariants = {
		hidden: { opacity: 0, y: 30 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.5 }
		}
	} as const

	return (
		<section
			className={styles.features}
			id='features'
		>
			<div className='container'>
				<motion.div
					className={styles.header}
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.5 }}
					transition={{ duration: 0.5 }}
				>
					<h2 className={styles.title}>
						Всё для управления ссылками
					</h2>
					<p className={styles.subtitle}>
						Наша платформа сочетает простое сокращение с мощными
						инструментами роста.
					</p>
				</motion.div>

				<motion.div
					className={styles.grid}
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.2 }}
				>
					{features.map(feature => {
						const IconComponent = feature.icon
						return (
							<motion.div
								key={feature.title}
								className={styles.card}
								variants={cardVariants}
								whileHover={{ y: -5, transition: { duration: 0.2 } }}
							>
								<div
									className={styles.iconWrapper}
									style={
										{
											'--icon-color': feature.color
										} as React.CSSProperties
									}
								>
									<IconComponent size={24} />
								</div>
								<h3 className={styles.cardTitle}>
									{feature.title}
								</h3>
								<p className={styles.cardDescription}>
									{feature.description}
								</p>
							</motion.div>
						)
					})}
				</motion.div>
			</div>
		</section>
	)
}

export default Features
