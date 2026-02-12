import {
	getBilling,
	type BillingResponse
} from '@/app/features/profile/api/profileApi'
import { useEffect, useState } from 'react'

export default function useBillingTab() {
	const [data, setData] = useState<BillingResponse | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		let active = true

		const load = async () => {
			setIsLoading(true)
			setError(null)

			try {
				const res = await getBilling()
				if (!active) return
				setData(res)
			} catch (e) {
				if (!active) return
				setError(
					e instanceof Error
						? e.message
						: 'Не удалось загрузить данные оплаты.'
				)
			} finally {
				if (active) setIsLoading(false)
			}
		}

		load()
		return () => {
			active = false
		}
	}, [])

	return { data, isLoading, error }
}
