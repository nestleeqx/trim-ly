'use client'
import {
	defaultFormData,
	LinkEditFormData,
	SHORT_LINK_DOMAIN
} from '@/app/features/links/components/LinkEdit/linkEdit.config'
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

	const linkKey = link.id
	const [prevLinkKey, setPrevLinkKey] = useState(linkKey)
	if (prevLinkKey !== linkKey) {
		setPrevLinkKey(linkKey)
		setFormData(initialData)
		setErrors({})
		setTouched({})
		setAdvancedOpen(hasAdvancedParams)
	}

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
			setFormData(prev => ({ ...prev, [field]: value }))
			setTouched(prev => ({ ...prev, [field]: true }))
		},
		[]
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
	}, [])

	const validateForm = useCallback(() => {
		const urlError = validateUrl(formData.destinationUrl)
		const dateError = validateExpirationDate(formData.expirationDate)
		const newErrors = {
			destinationUrl: urlError,
			expirationDate: dateError,
			shortLink: errors.shortLink
		}
		setErrors(newErrors)
		return !Object.values(newErrors).some(Boolean)
	}, [formData, errors.shortLink])

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
