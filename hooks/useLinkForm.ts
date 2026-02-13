'use client'
import {
	defaultFormData,
	LinkEditFormData,
	SHORT_LINK_DOMAIN
} from '@/app/features/links/components/LinkEdit/linkEdit.config'
import { validateSlug } from '@/app/features/links/validation/createLinkValidation'
import { useAliasCheck } from '@/hooks/useAliasCheck'
import { LinkItem } from '@/types/links'
import {
	normalizeUrl,
	validateExpirationDate,
	validateUrl
} from '@/utils/validation'
import { useCallback, useEffect, useMemo, useState } from 'react'

interface UseLinkFormProps {
	link: LinkItem
	onChange?: (data: LinkEditFormData, isDirty: boolean) => void
}

export const useLinkForm = ({ link, onChange }: UseLinkFormProps) => {
	const initialData = useMemo<LinkEditFormData>(
		() => ({
			...defaultFormData,
			destinationUrl: link.destination,
			shortLink: link.shortUrl.replace(SHORT_LINK_DOMAIN, ''),
			title: link.title,
			tags: [...link.tags],
			expirationDate: link.expirationDate
				? link.expirationDate.toISOString().split('T')[0]
				: '',
			passwordEnabled: link.hasPassword || false,
			password: ''
		}),
		[link]
	)

	const [formData, setFormData] = useState<LinkEditFormData>(initialData)
	const [errors, setErrors] = useState<Record<string, string | undefined>>({})
	const [touched, setTouched] = useState<Record<string, boolean>>({})

	const { aliasCheck, checkAliasAvailability } = useAliasCheck({
		initialAlias: initialData.shortLink,
		onError: error => setErrors(prev => ({ ...prev, shortLink: error }))
	})

	const hasAdvancedParams = useMemo(() => {
		return !!link.expirationDate || link.hasPassword
	}, [link])
	const [advancedOpen, setAdvancedOpen] = useState(hasAdvancedParams)

	useEffect(() => {
		setFormData(initialData)
		setErrors({})
		setTouched({})
		setAdvancedOpen(hasAdvancedParams)
	}, [link.id, initialData, hasAdvancedParams])

	const isDirty = useMemo(() => {
		const normalize = (d: LinkEditFormData) => ({
			destinationUrl: (d.destinationUrl || '').trim(),
			shortLink: (d.shortLink || '').trim(),
			title: (d.title || '').trim(),
			expirationDate: d.expirationDate || '',
			passwordEnabled: !!d.passwordEnabled,
			password: (d.password || '').trim(),
			tags: d.tags || [],
			folder: (d.folder || '').trim()
		})

		const a = normalize(formData)
		const b = normalize(initialData)

		return JSON.stringify(a) !== JSON.stringify(b)
	}, [formData, initialData])

	useEffect(() => {
		onChange?.(formData, isDirty)
	}, [formData, isDirty, onChange])

	const handleFieldChange = useCallback(
		(field: keyof LinkEditFormData, value: any) => {
			if (field === 'shortLink' && typeof value === 'string') {
				const normalized = value
					.trim()
					.toLowerCase()
					.replace(/\s+/g, '-')
				const localError = validateSlug(normalized)

				setFormData(prev => ({ ...prev, shortLink: normalized }))
				setTouched(prev => ({ ...prev, shortLink: true }))
				setErrors(prev => ({ ...prev, shortLink: localError }))

				if (!localError) {
					checkAliasAvailability(normalized)
				} else {
					checkAliasAvailability('')
				}
				return
			}

			setFormData(prev => ({ ...prev, [field]: value }))
			setTouched(prev => ({ ...prev, [field]: true }))
			if (field === 'password') {
				setErrors(prev => ({ ...prev, password: undefined }))
			}
		},
		[checkAliasAvailability]
	)

	const handleDestinationError = useCallback((error: string | undefined) => {
		setErrors(prev => ({ ...prev, destinationUrl: error }))
	}, [])

	const handleExpirationChange = useCallback(
		(value: string) => {
			handleFieldChange('expirationDate', value)
			const error = validateExpirationDate(value)
			setErrors(prev => ({ ...prev, expirationDate: error }))
		},
		[handleFieldChange]
	)

	const handleClearExpiration = useCallback(() => {
		handleFieldChange('expirationDate', '')
		setErrors(prev => ({ ...prev, expirationDate: undefined }))
	}, [handleFieldChange])

	const handlePasswordToggle = useCallback(() => {
		setFormData(prev => ({
			...prev,
			passwordEnabled: !prev.passwordEnabled,
			password: !prev.passwordEnabled ? prev.password : ''
		}))
		setErrors(prev => ({ ...prev, password: undefined }))
	}, [])

	const validateForm = useCallback(() => {
		const urlError = validateUrl(formData.destinationUrl)
		const dateError = validateExpirationDate(formData.expirationDate)

		const localShortLinkError = validateSlug(formData.shortLink)
		const shortLinkError = localShortLinkError ?? errors.shortLink

		let passwordError: string | undefined
		if (formData.passwordEnabled) {
			const pass = (formData.password || '').trim()
			if (!pass) {
				passwordError = 'Введите пароль.'
			} else if (pass.length < 6 || pass.length > 128) {
				passwordError = 'Пароль должен быть от 6 до 128 символов.'
			}
		}

		const newErrors = {
			destinationUrl: urlError,
			expirationDate: dateError,
			shortLink: shortLinkError,
			password: passwordError
		}

		setErrors(newErrors)
		return !Object.values(newErrors).some(Boolean)
	}, [
		formData.destinationUrl,
		formData.expirationDate,
		formData.shortLink,
		formData.passwordEnabled,
		formData.password,
		errors.shortLink
	])

	const getNormalizedData = useCallback(() => {
		return {
			...formData,
			destinationUrl: normalizeUrl(formData.destinationUrl)
		}
	}, [formData])

	return {
		formData,
		errors,
		touched,
		isDirty,
		advancedOpen,
		aliasCheck,
		setAdvancedOpen,
		handleFieldChange,
		handleDestinationError,
		handleExpirationChange,
		handleClearExpiration,
		handlePasswordToggle,
		checkAliasAvailability,
		validateForm,
		getNormalizedData,
		initialData
	}
}
