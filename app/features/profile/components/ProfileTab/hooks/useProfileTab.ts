import { mapProfileApiError } from '@/app/features/profile/utils/profileErrorMap'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
	getProfile,
	removeAvatar,
	updateProfile,
	uploadAvatar,
	uploadAvatarByUrl
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

function isValidHttpUrl(value: string) {
	try {
		const url = new URL(value)
		return url.protocol === 'http:' || url.protocol === 'https:'
	} catch {
		return false
	}
}

export default function useProfileTab() {
	const { update } = useSession()
	const avatarVersionRef = useRef(0)

	const [fullName, setFullName] = useState('')
	const [username, setUsername] = useState('')
	const [email, setEmail] = useState('')
	const [avatarURL, setAvatarURL] = useState<string | null>(null)
	const [avatarFile, setAvatarFile] = useState<File | null>(null)
	const [avatarInput, setAvatarInput] = useState('')
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
	const [avatarError, setAvatarError] = useState<string | null>(null)
	const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

	const clearFieldError = useCallback((field: keyof FieldErrors) => {
		setFieldErrors(prev => {
			if (!prev[field]) return prev
			const next = { ...prev }
			delete next[field]
			return next
		})
	}, [])

	const withAvatarCacheBust = useCallback((url: string | null) => {
		if (!url) return null
		if (!url.startsWith('/api/profile/personal-data/avatar')) return url

		avatarVersionRef.current += 1
		const suffix = `v=${avatarVersionRef.current}`
		return url.includes('?') ? `${url}&${suffix}` : `${url}?${suffix}`
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
			setAvatarURL(withAvatarCacheBust(data.avatarURL ?? null))

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
	}, [withAvatarCacheBust])

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
			setAvatarURL(withAvatarCacheBust(updated.avatarURL ?? null))

			setInitialProfile({
				name: nextName.trim(),
				username: normalizeUsername(nextUsername)
			})
			setFieldErrors({})

			await update({
				name: nextName || undefined,
				image: withAvatarCacheBust(updated.avatarURL ?? null) ?? undefined
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
	}, [fullName, update, username, withAvatarCacheBust])

	const finalizeAvatarUpdate = useCallback(
		async (nextAvatarURL: string | null, successMessage: string) => {
			const avatarWithVersion = withAvatarCacheBust(nextAvatarURL)
			setAvatarURL(avatarWithVersion)
			setAvatarFile(null)
			setAvatarInput('')
			setAvatarInputKey(prev => prev + 1)
			await update({ image: avatarWithVersion })
			setSuccess(successMessage)
		},
		[update, withAvatarCacheBust]
	)

	const handleUploadAvatarFile = useCallback(async (): Promise<boolean> => {
		setError(null)
		setSuccess(null)
		setAvatarError(null)

		if (!avatarFile) {
			setAvatarError('Выберите файл аватара.')
			return false
		}
		if (!ALLOWED_AVATAR_TYPES.has(avatarFile.type)) {
			setAvatarError('Поддерживаются только JPG, PNG и WEBP.')
			return false
		}
		if (avatarFile.size > MAX_AVATAR_SIZE_BYTES) {
			setAvatarError('Максимальный размер файла — 2MB.')
			return false
		}

		setIsAvatarSaving(true)
		try {
			const res = await uploadAvatar(avatarFile)
			await finalizeAvatarUpdate(res.avatarURL, 'Аватар обновлён.')
			return true
		} catch (e) {
			const mapped = mapProfileApiError(
				e instanceof Error ? e.message : '',
				'Не удалось обновить аватар.'
			)
			setAvatarError(mapped.message)
			return false
		} finally {
			setIsAvatarSaving(false)
		}
	}, [avatarFile, finalizeAvatarUpdate])

	const handleUploadAvatarByUrl = useCallback(
		async (): Promise<boolean> => {
			setError(null)
			setSuccess(null)
			setAvatarError(null)

			const trimmedUrl = avatarInput.trim()
			if (!trimmedUrl) {
				setAvatarError('Вставьте ссылку на изображение.')
				return false
			}
			if (!isValidHttpUrl(trimmedUrl)) {
				setAvatarError('Некорректная ссылка на изображение.')
				return false
			}

			setIsAvatarSaving(true)
			try {
				const res = await uploadAvatarByUrl(trimmedUrl)
				await finalizeAvatarUpdate(res.avatarURL, 'Аватар обновлён.')
				return true
			} catch (e) {
				const mapped = mapProfileApiError(
					e instanceof Error ? e.message : '',
					'Не удалось обновить аватар.'
				)
				setAvatarError(mapped.message)
				return false
			} finally {
				setIsAvatarSaving(false)
			}
		},
		[avatarInput, finalizeAvatarUpdate]
	)

	const handleRemoveAvatar = useCallback(async () => {
		setError(null)
		setSuccess(null)
		setAvatarError(null)

		setIsAvatarSaving(true)
		try {
			await removeAvatar()
			await finalizeAvatarUpdate(null, '')
			setError('Аватар удалён.')
		} catch (e) {
			const mapped = mapProfileApiError(
				e instanceof Error ? e.message : '',
				'Не удалось удалить аватар.'
			)
			setError(mapped.message)
		} finally {
			setIsAvatarSaving(false)
		}
	}, [finalizeAvatarUpdate])

	return {
		isLoading,
		error,
		success,
		fieldErrors,
		avatar: {
			avatarURL,
			fallbackInitial,
			avatarFileName: avatarFile?.name ?? '',
			avatarInput,
			avatarInputKey,
			avatarError,
			isAvatarSaving,
			onAvatarFileChange: setAvatarFile,
			onAvatarInputChange: setAvatarInput,
			onUploadAvatarFile: handleUploadAvatarFile,
			onUploadAvatarByUrl: handleUploadAvatarByUrl,
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
			hasProfileChanges,
			onSave: handleSave
		}
	}
}
