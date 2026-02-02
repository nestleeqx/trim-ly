'use client'

import { motion } from 'framer-motion'
import React from 'react'
import styles from './TrustedBy.module.scss'

const TrustedBy: React.FC = () => {
	const brands = ['Nova', 'Pixel', 'Studio', 'Marketly', 'Wave', 'Orbit']

	return (
		<section className={styles.trustedBy}>
			<div className='container'>
				<motion.p
					className={styles.label}
					initial={{ opacity: 0, y: 10 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.4 }}
				>
					НАМ ДОВЕРЯЮТ КРЕАТОРЫ И КОМАНДЫ
				</motion.p>
				<motion.div
					className={styles.brands}
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5, delay: 0.1 }}
				>
					{brands.map((brand, index) => (
						<motion.span
							key={brand}
							className={styles.brand}
							initial={{ opacity: 0, y: 10 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
						>
							{brand}
						</motion.span>
					))}
				</motion.div>
			</div>
		</section>
	)
}

export default TrustedBy
