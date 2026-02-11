import { signOut } from 'next-auth/react'
import { useCallback, useState } from 'react'

export function useLogout() {
	const [isLoading, setIsLoading] = useState(false)

	const logout = useCallback(async () => {
		setIsLoading(true)
		try {
			await signOut({
				redirect: true,
				callbackUrl: '/login'
			})
		} finally {
			setIsLoading(false)
		}
	}, [])

	return { logout, isLoading }
}
