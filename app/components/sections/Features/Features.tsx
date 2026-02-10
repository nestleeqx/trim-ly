'use client'

import { motion } from 'framer-motion'
import React from 'react'
import styles from './Features.module.scss'
import { cardVariants, containerVariants, features } from './features.config'

export default function Features() {
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
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true, amount: 0.2 }}
				>
					{features.map(feature => {
						const IconComponent = feature.icon
						return (
							<motion.div
								key={feature.title}
								className={styles.card}
								variants={cardVariants}
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
