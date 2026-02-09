'use client'
import { useLinkForm } from '@/hooks/useLinkForm'
import { LinkItem } from '@/types/links'
import React, { useCallback } from 'react'
import { AdvancedSettings } from './AdvancedSettings'
import { FormActions } from './FormActions'
import { FormFields } from './FormFields'
import { FormHeader } from './FormHeader'
import { LinkEditFormData } from './linkEdit.config'
import styles from './LinkEdit.module.scss'

interface LinkEditFormProps {
	link: LinkItem
	onSave: (data: LinkEditFormData) => void
	onCancel: () => void
	onChange?: (data: LinkEditFormData, isDirty: boolean) => void
	isLoading?: boolean
	mode?: 'edit' | 'create'
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

	const {
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
	} = useLinkForm({ link, onChange })

	const handleSubmit = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault()
			if (validateForm()) {
				onSave(getNormalizedData())
			}
		},
		[validateForm, onSave, getNormalizedData]
	)

	const aliasChanged = formData.shortLink !== initialData.shortLink
	const aliasChecking = aliasChanged && aliasCheck.checking
	const aliasAvailable =
		aliasChanged &&
		aliasCheck.checkedAlias === formData.shortLink &&
		aliasCheck.available

	const hasErrors = Object.values(errors).some(Boolean)
	const canSubmit = isCreateMode
		? !hasErrors &&
			!isLoading &&
			!aliasChecking &&
			!!formData.destinationUrl
		: isDirty && !hasErrors && !isLoading && !aliasChecking

	return (
		<form
			className={styles.form}
			onSubmit={handleSubmit}
		>
			{!isCreateMode && (
				<FormHeader
					link={link}
					isDirty={isDirty}
				/>
			)}
			<FormFields
				formData={formData}
				errors={errors}
				touched={touched}
				initialData={initialData}
				aliasChecking={aliasChecking}
				aliasAvailable={!!aliasAvailable}
				isCreateMode={isCreateMode}
				onFieldChange={handleFieldChange}
				onDestinationError={handleDestinationError}
				onAliasCheck={checkAliasAvailability}
			/>
			<AdvancedSettings
				expirationDate={formData.expirationDate}
				expirationError={errors.expirationDate}
				passwordEnabled={formData.passwordEnabled}
				password={formData.password}
				hasExistingPassword={!!link.hasPassword}
				isOpen={advancedOpen}
				onExpirationChange={handleExpirationChange}
				onClearExpiration={handleClearExpiration}
				onPasswordToggle={handlePasswordToggle}
				onPasswordChange={value => handleFieldChange('password', value)}
			/>
			<FormActions
				onCancel={onCancel}
				isLoading={isLoading}
				isCreateMode={isCreateMode}
				canSubmit={canSubmit}
			/>
		</form>
	)
}
