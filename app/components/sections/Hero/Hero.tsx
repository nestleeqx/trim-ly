'use client'

import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import Button from '../../ui/Button'
import DemoModal from '../../ui/DemoModal'
import ProductPreview from '../../ui/ProductPreview/ProductPreview'
import styles from './Hero.module.scss'
import { containerVariants, heroFeatures, itemVariants } from './hero.config'

const Hero: React.FC = () => {
	const [isDemoModalOpen, setIsDemoModalOpen] = useState(false)

	return (
		<section className={styles.hero}>
			<div className='container'>
				<div className={styles.content}>
					<motion.div
						className={styles.left}
						variants={containerVariants}
						initial='hidden'
						animate='visible'
					>
						<motion.div
							className={styles.badge}
							variants={itemVariants}
						>
							<Zap size={16} />
							<span>КОРОТКИЕ ССЫЛКИ + АНАЛИТИКА + QR</span>
						</motion.div>

						<motion.h1
							className={styles.title}
							variants={itemVariants}
						>
							Сокращайте ссылки. Отслеживайте клики. Делитесь
							умнее.
						</motion.h1>

						<motion.p
							className={styles.description}
							variants={itemVariants}
						>
							Создавайте брендированные короткие ссылки,
							генерируйте QR-коды и анализируйте эффективность с
							помощью аналитики в реальном времени.
						</motion.p>

						<motion.div
							className={styles.actions}
							variants={itemVariants}
						>
							<Link href='/signup'>
								<Button
									variant='primary'
									size='lg'
								>
									Создать аккаунт
								</Button>
							</Link>
							<Button
								variant='ghost'
								size='lg'
								onClick={() => setIsDemoModalOpen(true)}
							>
								Посмотреть демо
							</Button>
						</motion.div>

						<motion.p
							className={styles.note}
							variants={itemVariants}
						>
							Привязка карты не требуется
						</motion.p>

						<motion.div
							className={styles.features}
							variants={itemVariants}
						>
							{heroFeatures.map((feature, index) => {
								const IconComponent = feature.icon
								return (
									<div
										key={index}
										className={styles.feature}
									>
										<IconComponent size={20} />
										<span>{feature.text}</span>
									</div>
								)
							})}
						</motion.div>
					</motion.div>
					<motion.div
						initial={{ opacity: 0, x: 30 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6, delay: 0.3 }}
					>
						<ProductPreview />
					</motion.div>
				</div>
			</div>

			<DemoModal
				isOpen={isDemoModalOpen}
				onClose={() => setIsDemoModalOpen(false)}
			/>
		</section>
	)
}

export default Hero
