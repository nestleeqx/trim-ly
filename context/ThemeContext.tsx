'use client'

import React, {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useState
} from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
	theme: Theme
	toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

const getInitialTheme = (): Theme => {
	if (typeof window === 'undefined') return 'light'

	const stored = localStorage.getItem('theme') as Theme | null
	if (stored) return stored

	return window.matchMedia('(prefers-color-scheme: dark)').matches
		? 'dark'
		: 'light'
}

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
	children
}) => {
	const [theme, setTheme] = useState<Theme>(getInitialTheme)

	useEffect(() => {
		document.documentElement.setAttribute('data-theme', theme)
		localStorage.setItem('theme', theme)
	}, [theme])

	const toggleTheme = useCallback(() => {
		setTheme(t => (t === 'light' ? 'dark' : 'light'))
	}, [])

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	)
}

export const useTheme = (): ThemeContextType => {
	const ctx = useContext(ThemeContext)
	if (!ctx) {
		throw new Error('useTheme must be used within ThemeProvider')
	}
	return ctx
}
