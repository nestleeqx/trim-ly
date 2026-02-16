'use client'

import React, {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useState
} from 'react'

type Theme = 'light' | 'dark' | 'system'
type ResolvedTheme = 'light' | 'dark'

interface ThemeContextType {
	theme: Theme
	resolvedTheme: ResolvedTheme
	setTheme: (theme: Theme) => void
	toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

const getSystemTheme = (): ResolvedTheme => {
	if (typeof window === 'undefined') return 'light'
	return window.matchMedia('(prefers-color-scheme: dark)').matches
		? 'dark'
		: 'light'
}

const getInitialTheme = (): Theme => {
	if (typeof window === 'undefined') return 'system'
	const stored = localStorage.getItem('theme') as Theme | null
	if (stored === 'light' || stored === 'dark' || stored === 'system') {
		return stored
	}
	return 'system'
}

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
	children
}) => {
	const [theme, setThemeState] = useState<Theme>(getInitialTheme)
	const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
		theme === 'system' ? getSystemTheme() : theme
	)

	const setTheme = useCallback((next: Theme) => {
		setThemeState(next)
	}, [])

	const toggleTheme = useCallback(() => {
		setThemeState(prev => {
			const base = prev === 'system' ? getSystemTheme() : prev
			return base === 'light' ? 'dark' : 'light'
		})
	}, [])

	useEffect(() => {
		const media = window.matchMedia('(prefers-color-scheme: dark)')

		const apply = () => {
			const resolved =
				theme === 'system' ? (media.matches ? 'dark' : 'light') : theme

			setResolvedTheme(resolved)
			document.documentElement.setAttribute('data-theme', resolved)
			localStorage.setItem('theme', theme)
		}

		apply()

		const onChange = () => {
			if (theme === 'system') apply()
		}

		media.addEventListener('change', onChange)
		return () => media.removeEventListener('change', onChange)
	}, [theme])

	return (
		<ThemeContext.Provider
			value={{ theme, resolvedTheme, setTheme, toggleTheme }}
		>
			{children}
		</ThemeContext.Provider>
	)
}

export const useTheme = (): ThemeContextType => {
	const ctx = useContext(ThemeContext)
	if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
	return ctx
}
