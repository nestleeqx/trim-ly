import { mapProfileApiError } from '@/app/features/profile/utils/profileErrorMap'
import {
	getPasswordStrength,
	validateChangePassword,
	type ChangePasswordErrors
} from '@/app/features/profile/validation/securityValidation'
import { useCallback, useMemo, useState } from 'react'

export default function useSecurityTab() {
	const [currentPassword, setCurrentPassword] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')

	const [isSaving, setIsSaving] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [success, setSuccess] = useState<string | null>(null)
	const [fieldErrors, setFieldErrors] = useState<ChangePasswordErrors>({})

	const strength = useMemo(
		() => getPasswordStrength(newPassword),
		[newPassword]
	)

	const canSubmit = useMemo(() => {
		return (
			currentPassword.length > 0 &&
			newPassword.length > 0 &&
			confirmPassword.length > 0 &&
			!isSaving
		)
	}, [
		confirmPassword.length,
		currentPassword.length,
		isSaving,
		newPassword.length
	])

	const clearFieldError = useCallback((field: keyof ChangePasswordErrors) => {
		setFieldErrors(prev => {
			if (!prev[field]) return prev
			const next = { ...prev }
			delete next[field]
			return next
		})
	}, [])

	const handleSubmit = useCallback(async () => {
		setError(null)
		setSuccess(null)

		const errors = validateChangePassword({
			currentPassword,
			newPassword,
			confirmPassword
		})
		setFieldErrors(errors)

		if (Object.keys(errors).length > 0) return

		setFieldErrors(prev => {
			if (!prev.currentPassword) return prev
			const next = { ...prev }
			delete next.currentPassword
			return next
		})

		setIsSaving(true)
		try {
			const res = await fetch('/api/profile/change-password', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ currentPassword, newPassword })
			})

			const data = await res.json().catch(() => ({}))
			if (!res.ok) {
				const mapped = mapProfileApiError(
					String(data?.error ?? ''),
					'Не удалось обновить пароль.'
				)

				if (mapped.field === 'currentPassword') {
					setFieldErrors(prev => ({
						...prev,
						currentPassword: mapped.message
					}))
				} else if (mapped.field === 'newPassword') {
					setFieldErrors(prev => ({
						...prev,
						newPassword: mapped.message
					}))
				} else {
					setError(mapped.message)
				}
				return
			}

			setCurrentPassword('')
			setNewPassword('')
			setConfirmPassword('')
			setFieldErrors({})
			setSuccess('Пароль успешно обновлён.')
		} catch (e) {
			setError(
				e instanceof Error ? e.message : 'Не удалось обновить пароль.'
			)
		} finally {
			setIsSaving(false)
		}
	}, [confirmPassword, currentPassword, newPassword])

	return {
		currentPassword,
		newPassword,
		confirmPassword,
		setCurrentPassword: (v: string) => {
			setCurrentPassword(v)
			clearFieldError('currentPassword')
		},
		setNewPassword: (v: string) => {
			setNewPassword(v)
			clearFieldError('newPassword')
		},
		setConfirmPassword: (v: string) => {
			setConfirmPassword(v)
			clearFieldError('confirmPassword')
		},
		isSaving,
		error,
		success,
		fieldErrors,
		strength,
		canSubmit,
		handleSubmit
	}
}
