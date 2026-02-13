import { createLink } from '@/app/features/links/api/linksApi'
import {
	type CreateLinkErrors,
	validateCreateLink
} from '@/app/features/links/validation/createLinkValidation'
import { useCallback, useMemo, useState } from 'react'

type FormState = {
	targetUrl: string
	slug: string
	title: string
	expiresAt: string
	password: string
	tagIds: string[]
}

const initialState: FormState = {
	targetUrl: '',
	slug: '',
	title: '',
	expiresAt: '',
	password: '',
	tagIds: []
}

export default function useCreateLink() {
	const [form, setForm] = useState<FormState>(initialState)
	const [errors, setErrors] = useState<CreateLinkErrors>({})
	const [error, setError] = useState<string | null>(null)
	const [success, setSuccess] = useState<string | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)

	const setField = useCallback(
		<K extends keyof FormState>(key: K, value: FormState[K]) => {
			setForm(prev => ({ ...prev, [key]: value }))
			setError(null)
			setSuccess(null)

			if (key in errors) {
				setErrors(prev => {
					const next = { ...prev }
					delete (next as any)[key]
					return next
				})
			}
		},
		[errors]
	)

	const toggleTag = useCallback((tagId: string) => {
		setForm(prev => ({
			...prev,
			tagIds: prev.tagIds.includes(tagId)
				? prev.tagIds.filter(id => id !== tagId)
				: [...prev.tagIds, tagId]
		}))
	}, [])

	const canSubmit = useMemo(
		() => !!form.targetUrl.trim() && !!form.slug.trim() && !isSubmitting,
		[form.targetUrl, form.slug, isSubmitting]
	)

	const submit = useCallback(async () => {
		setError(null)
		setSuccess(null)

		const validation = validateCreateLink(form)
		setErrors(validation)
		if (Object.keys(validation).length > 0) return { ok: false as const }

		setIsSubmitting(true)
		try {
			const res = await createLink({
				targetUrl: form.targetUrl,
				slug: form.slug,
				title: form.title || undefined,
				expiresAt: form.expiresAt || null,
				password: form.password || undefined,
				tagIds: form.tagIds
			})

			setSuccess('Ссылка успешно создана.')
			return { ok: true as const, link: res.link }
		} catch (e) {
			setError(
				e instanceof Error ? e.message : 'Не удалось создать ссылку.'
			)
			return { ok: false as const }
		} finally {
			setIsSubmitting(false)
		}
	}, [form])

	return {
		form,
		errors,
		error,
		success,
		isSubmitting,
		canSubmit,
		setField,
		toggleTag,
		submit
	}
}
