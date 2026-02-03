'use client'

import { useRouter } from 'next/navigation'
import React from 'react'
import styles from './TopCountries.module.scss'

interface Country {
	code: string
	name: string
	percentage: number
}

const countries: Country[] = [
	{ code: 'US', name: 'США', percentage: 43 },
	{ code: 'DE', name: 'Германия', percentage: 21 },
	{ code: 'FR', name: 'Франция', percentage: 12 },
	{ code: 'GB', name: 'Великобритания', percentage: 8 },
	{ code: 'BR', name: 'Бразилия', percentage: 6 }
]

const TopCountries: React.FC = () => {
	const router = useRouter()

	const handleCountryClick = (countryCode: string) => {
		router.push(`/analytics?country=${countryCode.toLowerCase()}`)
	}

	return (
		<div className={styles.card}>
			<h3 className={styles.title}>Топ страны</h3>
			<div className={styles.list}>
				{countries.map(country => (
					<div
						key={country.code}
						className={styles.item}
						onClick={() => handleCountryClick(country.code)}
						role='button'
						tabIndex={0}
						onKeyDown={e => {
							if (e.key === 'Enter' || e.key === ' ') {
								handleCountryClick(country.code)
							}
						}}
						title={`Фильтр по ${country.name}`}
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
							{country.percentage}%
						</span>
					</div>
				))}
			</div>
		</div>
	)
}

export default TopCountries
