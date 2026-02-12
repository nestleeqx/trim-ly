import { mapProfileApiError } from '@/app/features/profile/utils/profileErrorMap'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
	getProfile,
	removeAvatar,
	updateProfile,
	uploadAvatar
} from '../../../../api/profileApi'
import {
	normalizeUsername,
	validateProfile
} from '../../../../validation/profileValidation'

type FieldErrors = Partial<Record<'name' | 'username', string>>

const MIN_AVATAR_SIZE = 80

async function checkImageMinSize(url: string, min = MIN_AVATAR_SIZE) {
	await new Promise<void>((resolve, reject) => {
		const img = new window.Image()
		img.onload = () => {
			if (img.naturalWidth < min || img.naturalHeight < min) {
				reject(
					new Error(`Минимальный размер изображения ${min}x${min}px.`)
				)
				return
			}
			resolve()
		}
		img.onerror = () =>
			reject(new Error('Не удалось прочитать изображение.'))
		img.src = url
	})
}

export default function useProfileTab() {
	const { update } = useSession()

	const [fullName, setFullName] = useState('')
	const [username, setUsername] = useState('')
	const [email, setEmail] = useState('')
	const [avatarURL, setAvatarURL] = useState<string | null>(null)

	const [avatarInput, setAvatarInput] = useState('')
	const [initialProfile, setInitialProfile] = useState({
		name: '',
		username: ''
	})

	const [isLoading, setIsLoading] = useState(true)
	const [isSaving, setIsSaving] = useState(false)
	const [isAvatarSaving, setIsAvatarSaving] = useState(false)

	const [error, setError] = useState<string | null>(null)
	const [success, setSuccess] = useState<string | null>(null)
	const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

	const clearFieldError = useCallback((field: keyof FieldErrors) => {
		setFieldErrors(prev => {
			if (!prev[field]) return prev
			const next = { ...prev }
			delete next[field]
			return next
		})
	}, [])

	const fallbackInitial = useMemo(() => {
		const source = fullName || username || email || 'U'
		return source.charAt(0).toUpperCase()
	}, [email, fullName, username])

	const hasProfileChanges = useMemo(() => {
		const currentName = fullName.trim()
		const currentUsername = normalizeUsername(username)
		return (
			currentName !== initialProfile.name ||
			currentUsername !== initialProfile.username
		)
	}, [fullName, initialProfile.name, initialProfile.username, username])

	const loadProfile = useCallback(async () => {
		setIsLoading(true)
		setError(null)

		try {
			const data = await getProfile()
			const nextName = data.name ?? ''
			const nextUsername = data.username ?? ''

			setFullName(nextName)
			setUsername(nextUsername ? `@${nextUsername}` : '')
			setEmail(data.email ?? '')
			setAvatarURL(data.avatarURL ?? null)

			setInitialProfile({
				name: nextName.trim(),
				username: normalizeUsername(nextUsername)
			})
			setFieldErrors({})
		} catch (e) {
			setError(
				e instanceof Error ? e.message : 'Не удалось загрузить профиль.'
			)
		} finally {
			setIsLoading(false)
		}
	}, [])

	useEffect(() => {
		loadProfile()
	}, [loadProfile])

	const handleSave = useCallback(async () => {
		setError(null)
		setSuccess(null)

		const validation = validateProfile({ name: fullName, username })
		setFieldErrors(validation.errors)

		if (Object.keys(validation.errors).length > 0) return

		setIsSaving(true)
		try {
			const updated = await updateProfile({
				name: validation.normalized.name,
				username: validation.normalized.username
			})

			const nextName = updated.name ?? ''
			const nextUsername = updated.username ?? ''

			setFullName(nextName)
			setUsername(nextUsername ? `@${nextUsername}` : '')
			setEmail(updated.email ?? '')
			setAvatarURL(updated.avatarURL ?? null)

			setInitialProfile({
				name: nextName.trim(),
				username: normalizeUsername(nextUsername)
			})
			setFieldErrors({})

			await update({
				name: nextName || undefined,
				image: updated.avatarURL ?? undefined
			})

			setSuccess('Профиль обновлён.')
		} catch (e) {
			const mapped = mapProfileApiError(
				e instanceof Error ? e.message : '',
				'Не удалось сохранить изменения.'
			)

			if (mapped.field === 'username') {
				setFieldErrors(prev => ({ ...prev, username: mapped.message }))
			} else if (mapped.field === 'name') {
				setFieldErrors(prev => ({ ...prev, name: mapped.message }))
			} else {
				setError(mapped.message)
			}
		} finally {
			setIsSaving(false)
		}
	}, [fullName, update, username])

	const handleSetAvatar = useCallback(async () => {
		setError(null)
		setSuccess(null)

		const url = avatarInput.trim()
		if (!url) {
			setError('Введите ссылку на изображение.')
			return
		}

		setIsAvatarSaving(true)
		try {
			await checkImageMinSize(url)
			const res = await uploadAvatar(url)
			setAvatarURL(res.avatarURL)

			await update({ image: res.avatarURL })
			setAvatarInput('')
			setSuccess('Аватар обновлён.')
		} catch (e) {
			const mapped = mapProfileApiError(
				e instanceof Error ? e.message : '',
				'Не удалось обновить аватар.'
			)
			setError(mapped.message)
		} finally {
			setIsAvatarSaving(false)
		}
	}, [avatarInput, update])

	const handleRemoveAvatar = useCallback(async () => {
		setError(null)
		setSuccess(null)

		setIsAvatarSaving(true)
		try {
			await removeAvatar()
			setAvatarURL(null)
			await update({ image: null })
			setSuccess('Аватар удалён.')
		} catch (e) {
			const mapped = mapProfileApiError(
				e instanceof Error ? e.message : '',
				'Не удалось удалить аватар.'
			)
			setError(mapped.message)
		} finally {
			setIsAvatarSaving(false)
		}
	}, [update])

	return {
		isLoading,
		error,
		success,
		fieldErrors,

		avatar: {
			avatarURL,
			fallbackInitial,
			avatarInput,
			isAvatarSaving,
			onAvatarInputChange: setAvatarInput,
			onSetAvatar: handleSetAvatar,
			onRemoveAvatar: handleRemoveAvatar
		},

		form: {
			fullName,
			username,
			email,
			fieldErrors,
			onFullNameChange: (value: string) => {
				setFullName(value)
				clearFieldError('name')
			},
			onUsernameChange: (value: string) => {
				setUsername(value)
				clearFieldError('username')
			}
		},

		actions: {
			isSaving,
			isError: Object.keys(fieldErrors).length > 0,
			hasProfileChanges: hasProfileChanges,
			onSave: handleSave
		}
	}
}
