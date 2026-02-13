'use client'

import React, { useCallback } from 'react'
import DestinationUrlInput from './DestinationUrlInput'
import styles from './LinkEdit.module.scss'
import ShortLinkInput from './ShortLinkInput'
import TagsInput from './TagsInput'
import { LinkEditFormData } from './linkEdit.config'

interface FormFieldsProps {
	formData: LinkEditFormData
	errors: Record<string, string | undefined>
	touched: Record<string, boolean>
	initialData: LinkEditFormData
	aliasChecking: boolean
	aliasAvailable: boolean
	isCreateMode: boolean
	onFieldChange: (field: keyof LinkEditFormData, value: any) => void
	onDestinationError: (error: string | undefined) => void
}

export default function FormFields({
	formData,
	errors,
	touched,
	initialData,
	aliasChecking,
	aliasAvailable,
	isCreateMode,
	onFieldChange,
	onDestinationError
}: FormFieldsProps) {
	const handleTitleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			onFieldChange('title', e.target.value)
		},
		[onFieldChange]
	)

	const handleTagsChange = useCallback(
		(tags: string[]) => {
			onFieldChange('tags', tags)
		},
		[onFieldChange]
	)

	return (
		<>
			<DestinationUrlInput
				value={formData.destinationUrl}
				error={errors.destinationUrl}
				touched={touched.destinationUrl}
				onChange={value => onFieldChange('destinationUrl', value)}
				onError={onDestinationError}
				onTouch={() =>
					onFieldChange('destinationUrl', formData.destinationUrl)
				}
			/>
			<div className={styles.formRow}>
				<ShortLinkInput
					value={formData.shortLink}
					error={errors.shortLink}
					initialValue={initialData.shortLink}
					aliasChecking={aliasChecking}
					aliasAvailable={aliasAvailable}
					isEditMode={!isCreateMode}
					onChange={value => onFieldChange('shortLink', value)}
				/>
				<div className={styles.formGroup}>
					<label className={styles.label}>
						Заголовок (необязательно)
					</label>
					<input
						type='text'
						name='title'
						value={formData.title}
						onChange={handleTitleChange}
						placeholder='Example: Black Friday campaign'
						className={styles.input}
					/>
					<span className={styles.hint}>Видите только вы.</span>
				</div>
			</div>
			<TagsInput
				tags={formData.tags}
				onChange={handleTagsChange}
			/>
		</>
	)
}
