'use client'

import React from 'react'
import styles from './TrustedBy.module.scss'

const TrustedBy: React.FC = () => {
	const brands = ['Nova', 'Pixel', 'Studio', 'Marketly', 'Wave', 'Orbit']

	return (
		<section className={styles.trustedBy}>
			<div className='container'>
				<p className={styles.label}>
					НАМ ДОВЕРЯЮТ КРЕАТОРЫ И КОМАНДЫ
				</p>
				<div className={styles.brands}>
					{brands.map(brand => (
						<span
							key={brand}
							className={styles.brand}
						>
							{brand}
						</span>
					))}
				</div>
			</div>
		</section>
	)
}

export default TrustedBy
