'use client'

import { TopCountry } from '@/types/charts'
import React from 'react'
import styles from './TopCountries.module.scss'

interface TopCountriesProps {
	countries: TopCountry[]
}

const TopCountries: React.FC<TopCountriesProps> = ({ countries }) => {
	return (
		<div className={styles.card}>
			<h3 className={styles.title}>Топ страны</h3>
			<div className={styles.list}>
				{countries.map(country => (
					<div
						key={country.code}
						className={styles.item}
					>
						<div className={styles.info}>
							<span className={styles.code}>{country.code}</span>
							<span className={styles.name}>{country.name}</span>
						</div>
						<div className={styles.barContainer}>
							<div
								className={styles.bar}
								style={{ width: `${country.percentage}%` }}
							/>
						</div>
						<span className={styles.percentage}>
							{country.clicks} клик(-ов)
						</span>
					</div>
				))}
			</div>
		</div>
	)
}

export default TopCountries
