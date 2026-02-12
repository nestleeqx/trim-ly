'use client'

import {
	getPreferences,
	type ThemeValue,
	updatePreferences
} from '@/app/features/profile/api/profileApi'
import { mapProfileApiError } from '@/app/features/profile/utils/profileErrorMap'
import { useTheme } from '@/context/ThemeContext'
import { useCallback, useEffect, useRef, useState } from 'react'

export default function usePreferenceTab() {
	const { setTheme: applyTheme } = useTheme()

	const [theme, setTheme] = useState<ThemeValue>('system')
	const [initialTheme, setInitialTheme] = useState<ThemeValue>('system')
	const [isLoading, setIsLoading] = useState(true)
	const [isSaving, setIsSaving] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [success, setSuccess] = useState<string | null>(null)

	const themeRef = useRef(theme)
	const initialThemeRef = useRef(initialTheme)

	const hasChanges = theme !== initialTheme

	useEffect(() => {
		themeRef.current = theme
	}, [theme])

	useEffect(() => {
		initialThemeRef.current = initialTheme
	}, [initialTheme])

	useEffect(() => {
		return () => {
			const hasUnsaved = themeRef.current !== initialThemeRef.current
			if (hasUnsaved) {
				applyTheme(initialThemeRef.current)
			}
		}
	}, [applyTheme])

	useEffect(() => {
		let active = true

		const load = async () => {
			setIsLoading(true)
			setError(null)

			try {
				const data = await getPreferences()
				if (!active) return

				setTheme(data.theme)
				setInitialTheme(data.theme)
				applyTheme(data.theme)
			} catch (e) {
				if (!active) return
				const mapped = mapProfileApiError(
					e instanceof Error ? e.message : '',
					'Не удалось загрузить настройки оформления.'
				)
				setError(mapped.message)
			} finally {
				if (active) setIsLoading(false)
			}
		}

		load()
		return () => {
			active = false
		}
	}, [applyTheme])

	const handleSelectTheme = useCallback(
		(next: ThemeValue) => {
			setTheme(next)
			applyTheme(next)
			setError(null)
			setSuccess(null)
		},
		[applyTheme]
	)

	const save = useCallback(async () => {
		setError(null)
		setSuccess(null)
		setIsSaving(true)

		try {
			const res = await updatePreferences({ theme })
			setTheme(res.theme)
			setInitialTheme(res.theme)
			applyTheme(res.theme)
			setSuccess('Оформление сохранено.')
		} catch (e) {
			const mapped = mapProfileApiError(
				e instanceof Error ? e.message : '',
				'Не удалось сохранить настройки оформления.'
			)
			setError(mapped.message)
		} finally {
			setIsSaving(false)
		}
	}, [applyTheme, theme])

	return {
		theme,
		isLoading,
		isSaving,
		error,
		success,
		hasChanges,
		handleSelectTheme,
		save
	}
}
