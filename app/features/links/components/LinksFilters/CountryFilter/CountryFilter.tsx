'use client'

import { mockTopCountries } from '@/data/mockDashboardData'
import { Check } from 'lucide-react'
import commonStyles from '../FilterCommon.module.scss'
import FilterDropdown from '../FilterDropdown/FilterDropdown'

interface CountryFilterProps {
	selectedCountry?: string | null
	onCountryChange?: (countryCode: string | null) => void
	countries?: { code: string; name: string }[]
}

export default function CountryFilter({
	selectedCountry,
	onCountryChange,
	countries = mockTopCountries.map(c => ({ code: c.code, name: c.name }))
}: CountryFilterProps) {
	return (
		<FilterDropdown
			label='Страна'
			badgeCount={selectedCountry ? 1 : 0}
			hasSelection={!!selectedCountry}
		>
			<button
				className={`${commonStyles.dropdownItem} ${!selectedCountry ? commonStyles.selected : ''}`}
				onClick={() => onCountryChange?.(null)}
			>
				<span className={commonStyles.checkbox} />
				Все
			</button>

			{countries.map(country => (
				<button
					key={country.code}
					className={`${commonStyles.dropdownItem} ${selectedCountry === country.code ? commonStyles.selected : ''}`}
					onClick={() => onCountryChange?.(country.code)}
				>
					<span className={commonStyles.checkbox}>
						{selectedCountry === country.code && (
							<Check size={12} />
						)}
					</span>
					{country.name}
				</button>
			))}
		</FilterDropdown>
	)
}
