'use client'

import Button from '@/app/components/ui/Button'
import { LinkItem, LinkStatus } from '@/types/links'
import {
	AlertCircle,
	AlertTriangle,
	Calendar,
	Check,
	ChevronDown,
	ChevronUp,
	Link2,
	Loader2,
	Lock,
	Settings,
	Tag,
	X
} from 'lucide-react'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styles from './LinkEdit.module.scss'
import {
	defaultFormData,
	existingTags,
	LinkEditFormData,
	SHORT_LINK_DOMAIN,
	takenAliases
} from './linkEdit.config'

interface LinkEditFormProps {
	link: LinkItem
	onSave: (data: LinkEditFormData) => void
	onCancel: () => void
	onChange?: (data: LinkEditFormData, isDirty: boolean) => void
	isLoading?: boolean
	mode?: 'edit' | 'create'
}

interface FormErrors {
	destinationUrl?: string
	shortLink?: string
	expirationDate?: string
}

interface AliasCheckState {
	checking: boolean
	available: boolean | null
	checkedAlias: string
}

const statusLabels: Record<LinkStatus, string> = {
	active: 'Активна',
	paused: 'На паузе',
	expired: 'Истекла',
	deleted: 'Удалена'
}

const isValidUrl = (url: string): boolean => {
	try {
		new URL(url)
		return true
	} catch {
		return false
	}
}

const normalizeUrl = (url: string): string => {
	if (!url) return url
	const trimmed = url.trim()
	if (!trimmed) return trimmed

	// Auto-add https:// if no protocol
	if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
		return `https://${trimmed}`
	}
	return trimmed
}

export const LinkEditForm: React.FC<LinkEditFormProps> = ({
	link,
	onSave,
	onCancel,
	onChange,
	isLoading = false,
	mode = 'edit'
}) => {
	const isCreateMode = mode === 'create'
	// Initial data from link
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

	// Use link.id as key to reset form state when link changes
	const linkKey = link.id

	const [formData, setFormData] = useState<LinkEditFormData>(initialData)
	const [errors, setErrors] = useState<FormErrors>({})
	const [touched, setTouched] = useState<Record<string, boolean>>({})

	// Alias availability check - only track async check results
	const [aliasCheck, setAliasCheck] = useState<AliasCheckState>({
		checking: false,
		available: null,
		checkedAlias: ''
	})
	const aliasCheckTimeout = useRef<NodeJS.Timeout | null>(null)

	// Tag suggestions
	const [tagInput, setTagInput] = useState('')
	const [showTagSuggestions, setShowTagSuggestions] = useState(false)

	// Advanced accordion - open by default if link has advanced params
	const hasAdvancedParams = useMemo(() => {
		return !!link.expirationDate || link.hasPassword
	}, [link, initialData])
	const [advancedOpen, setAdvancedOpen] = useState(hasAdvancedParams)

	// Reset form when link changes by comparing with previous initial data
	const [prevLinkKey, setPrevLinkKey] = useState(linkKey)
	if (prevLinkKey !== linkKey) {
		setPrevLinkKey(linkKey)
		setFormData(initialData)
		setErrors({})
		setTouched({})
		setAliasCheck({ checking: false, available: null, checkedAlias: '' })
		setAdvancedOpen(hasAdvancedParams)
	}

	// Derived alias state
	const aliasChanged = formData.shortLink !== initialData.shortLink

	// Current alias check status based on what we've checked
	const aliasChecking = aliasChanged && aliasCheck.checking
	const aliasAvailable =
		aliasChanged &&
		aliasCheck.checkedAlias === formData.shortLink &&
		aliasCheck.available

	// Check if form is dirty (has changes) - deep-compare normalized values
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

		// JSON stringify is OK because fields are primitives/arrays and order of tags matters
		return JSON.stringify(a) !== JSON.stringify(b)
	}, [formData, initialData])

	// Debounced alias check function - called from onChange handler
	const checkAliasAvailability = useCallback(
		(alias: string) => {
			if (aliasCheckTimeout.current) {
				clearTimeout(aliasCheckTimeout.current)
			}

			// If alias is same as original, clear errors and don't check
			if (alias === initialData.shortLink) {
				setAliasCheck({
					checking: false,
					available: null,
					checkedAlias: ''
				})
				setErrors(prev => ({ ...prev, shortLink: undefined }))
				return
			}

			// If empty, don't check
			if (!alias) {
				setAliasCheck({
					checking: false,
					available: null,
					checkedAlias: ''
				})
				return
			}

			setAliasCheck(prev => ({ ...prev, checking: true }))

			aliasCheckTimeout.current = setTimeout(() => {
				// Simulate API check
				const isTaken = takenAliases.includes(alias.toLowerCase())
				setAliasCheck({
					checking: false,
					available: !isTaken,
					checkedAlias: alias
				})

				if (isTaken) {
					setErrors(prev => ({
						...prev,
						shortLink: 'Этот alias уже занят'
					}))
				} else {
					setErrors(prev => ({ ...prev, shortLink: undefined }))
				}
			}, 500)
		},
		[initialData.shortLink]
	)

	// Cleanup timeout on unmount
	useEffect(() => {
		return () => {
			if (aliasCheckTimeout.current) {
				clearTimeout(aliasCheckTimeout.current)
			}
		}
	}, [])

	// Notify parent of form changes for realtime preview
	useEffect(() => {
		onChange?.(formData, isDirty)
	}, [formData, isDirty, onChange])

	// Tag suggestions filtered
	const filteredTags = useMemo(() => {
		if (!tagInput.trim())
			return existingTags.filter(t => !formData.tags.includes(t))
		return existingTags.filter(
			t =>
				t.toLowerCase().includes(tagInput.toLowerCase()) &&
				!formData.tags.includes(t)
		)
	}, [tagInput, formData.tags])

	// Validate URL in realtime
	const validateUrl = useCallback((url: string): string | undefined => {
		if (!url) return 'URL обязателен для заполнения'
		const normalized = normalizeUrl(url)
		if (!isValidUrl(normalized)) return 'Некорректный URL'
		return undefined
	}, [])

	// Validate expiration date
	const validateExpirationDate = useCallback(
		(date: string): string | undefined => {
			if (!date) return undefined
			const selectedDate = new Date(date)
			const today = new Date()
			today.setHours(0, 0, 0, 0)
			if (selectedDate < today) {
				return 'Дата не может быть в прошлом'
			}
			return undefined
		},
		[]
	)

	// Handle destination URL change with auto-https
	const handleDestinationChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			let value = e.target.value
			// strip Cyrillic characters
			value = value.replace(/[а-яА-ЯёЁ]/g, '')
			setFormData(prev => ({ ...prev, destinationUrl: value }))
			setTouched(prev => ({ ...prev, destinationUrl: true }))

			// Realtime validation
			const error = validateUrl(value)
			setErrors(prev => ({ ...prev, destinationUrl: error }))
		},
		[validateUrl]
	)

	// Handle URL blur - normalize with https
	const handleDestinationBlur = useCallback(() => {
		const normalized = normalizeUrl(formData.destinationUrl)
		if (normalized !== formData.destinationUrl) {
			setFormData(prev => ({ ...prev, destinationUrl: normalized }))
		}
		// Revalidate
		const error = validateUrl(normalized)
		setErrors(prev => ({ ...prev, destinationUrl: error }))
	}, [formData.destinationUrl, validateUrl])

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
			const { name } = e.target
			let value = (e.target as HTMLInputElement).value
			// prevent Cyrillic in shortLink and password fields
			if (name === 'shortLink' || name === 'password') {
				value = value.replace(/[а-яА-ЯёЁ]/g, '')
			}
			setFormData(prev => ({ ...prev, [name]: value }))
			setTouched(prev => ({ ...prev, [name]: true }))

			// Trigger alias check when shortLink changes
			if (name === 'shortLink') {
				checkAliasAvailability(value)
			}
		},
		[checkAliasAvailability]
	)

	// Handle expiration date change with validation
	const handleExpirationChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value
			setFormData(prev => ({ ...prev, expirationDate: value }))
			setTouched(prev => ({ ...prev, expirationDate: true }))

			const error = validateExpirationDate(value)
			setErrors(prev => ({ ...prev, expirationDate: error }))
		},
		[validateExpirationDate]
	)

	// Clear expiration date
	const handleClearExpiration = useCallback(() => {
		setFormData(prev => ({ ...prev, expirationDate: '' }))
		setErrors(prev => ({ ...prev, expirationDate: undefined }))
	}, [])

	// Toggle password protection
	const handlePasswordToggle = useCallback(() => {
		setFormData(prev => ({
			...prev,
			passwordEnabled: !prev.passwordEnabled,
			password: !prev.passwordEnabled ? prev.password : ''
		}))
	}, [])

	const handleAddTag = useCallback(
		(tag: string) => {
			const trimmedTag = tag.trim()
			if (formData.tags.length >= 5) {
				setTagInput('')
				setShowTagSuggestions(false)
				return
			}
			if (trimmedTag && !formData.tags.includes(trimmedTag)) {
				setFormData(prev => ({
					...prev,
					tags: [...prev.tags, trimmedTag]
				}))
			}
			setTagInput('')
			setShowTagSuggestions(false)
		},
		[formData.tags]
	)

	const handleTagKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === 'Enter' && tagInput.trim()) {
				e.preventDefault()
				handleAddTag(tagInput)
			}
		},
		[tagInput, handleAddTag]
	)

	const handleRemoveTag = useCallback((tagToRemove: string) => {
		setFormData(prev => ({
			...prev,
			tags: prev.tags.filter(tag => tag !== tagToRemove)
		}))
	}, [])

	const handleSubmit = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault()

			// Final validation
			const urlError = validateUrl(formData.destinationUrl)
			const dateError = validateExpirationDate(formData.expirationDate)

			if (urlError || dateError || errors.shortLink) {
				setErrors(prev => ({
					...prev,
					destinationUrl: urlError,
					expirationDate: dateError
				}))
				return
			}

			// Normalize URL before saving
			const normalizedData = {
				...formData,
				destinationUrl: normalizeUrl(formData.destinationUrl)
			}
			onSave(normalizedData)
		},
		[
			formData,
			onSave,
			validateUrl,
			validateExpirationDate,
			errors.shortLink
		]
	)

	const hasErrors = Object.values(errors).some(Boolean)
	const canSubmit = isCreateMode
		? !hasErrors && !isLoading && !aliasChecking && !!formData.destinationUrl
		: isDirty && !hasErrors && !isLoading && !aliasChecking

	return (
		<form
			className={styles.form}
			onSubmit={handleSubmit}
		>
			{/* Status display - only in edit mode */}
			{!isCreateMode && (
				<div className={styles.formStatus}>
					<span className={styles.statusLabel}>Статус ссылки:</span>
					<div className={styles.statusValue}>
						<span
							className={`${styles.statusBadge} ${styles[link.status]}`}
						>
							{statusLabels[link.status]}
						</span>
						{isDirty && (
							<span className={styles.dirtyIndicator}>
								Есть несохранённые изменения
							</span>
						)}
					</div>
				</div>
			)}

			{/* Destination URL */}
			<div className={styles.formGroup}>
				<label className={styles.label}>Целевой URL</label>
				<div className={styles.inputWrapper}>
					<Link2
						size={18}
						className={styles.inputIcon}
					/>
					<input
						type='text'
						name='destinationUrl'
						value={formData.destinationUrl}
						onChange={handleDestinationChange}
						onBlur={handleDestinationBlur}
						placeholder='https://example.com/very/long/link'
						className={`${styles.input} ${
							touched.destinationUrl && errors.destinationUrl
								? styles.error
								: ''
						}`}
						required
					/>
				</div>
				{touched.destinationUrl && errors.destinationUrl && (
					<span className={styles.fieldError}>
						<AlertCircle size={12} />
						{errors.destinationUrl}
					</span>
				)}
			</div>

			{/* Short link and Title row */}
			<div className={styles.formRow}>
				<div className={styles.formGroup}>
					<label className={styles.label}>Короткая ссылка</label>
					<div
						className={`${styles.shortLinkWrapper} ${
							errors.shortLink ? styles.error : ''
						} ${aliasAvailable ? styles.success : ''}`}
					>
						<span className={styles.shortLinkPrefix}>
							{SHORT_LINK_DOMAIN}
						</span>
						<input
							type='text'
							name='shortLink'
							value={formData.shortLink}
							onChange={handleChange}
							placeholder='alias'
							className={styles.shortLinkInput}
						/>
						{aliasChecking && (
							<Loader2
								size={16}
								className={styles.aliasSpinner}
							/>
						)}
						{!aliasChecking && aliasAvailable && (
							<Check
								size={16}
								className={styles.aliasSuccess}
							/>
						)}
					</div>
					{errors.shortLink && (
						<span className={styles.fieldError}>
							<AlertCircle size={12} />
							{errors.shortLink}
						</span>
					)}
					{!isCreateMode && aliasChanged && !errors.shortLink && (
						<span className={styles.fieldWarning}>
							<AlertTriangle size={12} />
							Изменение alias сломает старую ссылку
						</span>
					)}
				</div>

				<div className={styles.formGroup}>
					<label className={styles.label}>
						Название (необязательно)
					</label>
					<input
						type='text'
						name='title'
						value={formData.title}
						onChange={handleChange}
						placeholder='Например: Black Friday campaign'
						className={styles.input}
					/>
					<span className={styles.hint}>Видно только вам.</span>
				</div>
			</div>

			{/* Tags */}
			<div className={styles.formGroup}>
				<label className={styles.label}>
					<Tag size={16} />
					Теги
				</label>
				<div className={styles.tagsContainer}>
					<div className={styles.tagsWrapper}>
						{formData.tags.map(tag => (
							<span
								key={tag}
								className={styles.tag}
							>
								{tag}
								<button
									type='button'
									onClick={() => handleRemoveTag(tag)}
									className={styles.tagRemove}
								>
									<X size={12} />
								</button>
							</span>
						))}
						<input
							type='text'
							value={tagInput}
							onChange={e => setTagInput(e.target.value)}
							onKeyDown={handleTagKeyDown}
							onFocus={() => setShowTagSuggestions(true)}
							onBlur={() =>
								setTimeout(
									() => setShowTagSuggestions(false),
									200
								)
							}
							placeholder='Добавить тег...'
							className={styles.tagInput}
							disabled={formData.tags.length >= 5}
						/>
					</div>
					{formData.tags.length >= 5 && (
						<span className={styles.hint}>Максимум 5 тегов</span>
					)}
					{showTagSuggestions && filteredTags.length > 0 && (
						<div className={styles.tagSuggestions}>
							{filteredTags.slice(0, 5).map(tag => (
								<button
									key={tag}
									type='button'
									className={styles.tagSuggestion}
									onMouseDown={() => handleAddTag(tag)}
								>
									{tag}
								</button>
							))}
						</div>
					)}
				</div>
			</div>

			{/* Advanced Settings Accordion */}
			<div className={styles.accordion}>
				<button
					type='button'
					className={styles.accordionHeader}
					onClick={() => setAdvancedOpen(!advancedOpen)}
				>
					<span className={styles.accordionTitle}>
						<Settings size={18} />
						Расширенные настройки
					</span>
					{advancedOpen ? (
						<ChevronUp size={20} />
					) : (
						<ChevronDown size={20} />
					)}
				</button>

				{advancedOpen && (
					<div className={styles.accordionContent}>
						{/* Expiration and Password row */}
						<div className={styles.formRow}>
							<div className={styles.formGroup}>
								<label className={styles.label}>
									<Calendar size={16} />
									Дата истечения
								</label>
								<div className={styles.dateInputWrapper}>
									<input
										type='date'
										name='expirationDate'
										value={formData.expirationDate}
										onChange={handleExpirationChange}
										className={`${styles.input} ${
											errors.expirationDate
												? styles.error
												: ''
										}`}
									/>
									{formData.expirationDate && (
										<button
											type='button'
											className={styles.clearDateBtn}
											onClick={handleClearExpiration}
										>
											<X size={16} />
										</button>
									)}
								</div>
								{errors.expirationDate && (
									<span className={styles.fieldError}>
										<AlertCircle size={12} />
										{errors.expirationDate}
									</span>
								)}
							</div>

							<div className={styles.formGroup}>
								<label className={styles.label}>
									<Lock size={16} />
									Защита паролем
								</label>
								<div className={styles.passwordSection}>
									<label className={styles.toggle}>
										<input
											type='checkbox'
											checked={formData.passwordEnabled}
											onChange={handlePasswordToggle}
											className={styles.toggleInput}
										/>
										<span
											className={styles.toggleSlider}
										></span>
										<span className={styles.toggleLabel}>
											{formData.passwordEnabled
												? 'Включена'
												: 'Отключена'}
										</span>
									</label>
									{formData.passwordEnabled && (
										<>
											<input
												type='password'
												name='password'
												value={formData.password}
												onChange={handleChange}
												placeholder='Установить новый пароль'
												className={styles.input}
											/>
											{link.hasPassword && (
												<span className={styles.hint}>
													Оставьте пустым, чтобы
													сохранить текущий пароль.
												</span>
											)}
										</>
									)}
								</div>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Actions */}
			<div className={styles.formActions}>
				<Button
					variant='ghost'
					onClick={onCancel}
					type='button'
				>
					Отмена
				</Button>
				<Button
					variant='primary'
					type='submit'
					disabled={!canSubmit}
				>
					{isLoading
						? isCreateMode
							? 'Создание...'
							: 'Сохранение...'
						: isCreateMode
							? 'Создать ссылку'
							: 'Сохранить изменения'}
				</Button>
			</div>
		</form>
	)
}
