import { mapProfileApiError } from '@/app/features/profile/utils/profileErrorMap'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
	getProfile,
	removeAvatar,
	updateProfile,
	uploadAvatar
} from '../../../api/profileApi'
import {
	normalizeUsername,
	validateProfile
} from '../../../validation/profileValidation'

type FieldErrors = Partial<Record<'name' | 'username', string>>

const ALLOWED_AVATAR_TYPES = new Set([
	'image/jpeg',
	'image/png',
	'image/webp'
])
const MAX_AVATAR_SIZE_BYTES = 2 * 1024 * 1024

export default function useProfileTab() {
	const { update } = useSession()

	const [fullName, setFullName] = useState('')
	const [username, setUsername] = useState('')
	const [email, setEmail] = useState('')
	const [avatarURL, setAvatarURL] = useState<string | null>(null)
	const [avatarFile, setAvatarFile] = useState<File | null>(null)
	const [avatarInputKey, setAvatarInputKey] = useState(0)

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
		void loadProfile()
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

		if (!avatarFile) {
			setError('Выберите файл аватара.')
			return
		}

		if (!ALLOWED_AVATAR_TYPES.has(avatarFile.type)) {
			setError('Поддерживаются только JPG, PNG и WEBP.')
			return
		}

		if (avatarFile.size > MAX_AVATAR_SIZE_BYTES) {
			setError('Максимальный размер файла — 2MB.')
			return
		}

		setIsAvatarSaving(true)
		try {
			const res = await uploadAvatar(avatarFile)
			setAvatarURL(res.avatarURL)

			await update({ image: res.avatarURL })
			setAvatarFile(null)
			setAvatarInputKey(prev => prev + 1)
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
	}, [avatarFile, update])

	const handleRemoveAvatar = useCallback(async () => {
		setError(null)
		setSuccess(null)

		setIsAvatarSaving(true)
		try {
			await removeAvatar()
			setAvatarURL(null)
			setAvatarFile(null)
			setAvatarInputKey(prev => prev + 1)
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
			avatarFileName: avatarFile?.name ?? '',
			avatarInputKey,
			isAvatarSaving,
			onAvatarFileChange: setAvatarFile,
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
