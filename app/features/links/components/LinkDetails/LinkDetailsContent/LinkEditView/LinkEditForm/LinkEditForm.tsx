'use client'
import { LinkEditFormData } from '@/app/features/links/components/LinkEdit/linkEdit.config'
import { useLinkForm } from '@/app/features/links/hooks/useLinkForm'
import { LinkItem } from '@/types/links'
import { useCallback } from 'react'
import AdvancedSettings from '../../../../LinkEdit/AdvancedSettings'
import FormActions from '../../../../LinkEdit/FormActions'
import FormFields from '../../../../LinkEdit/FormFields'
import FormHeader from '../../../../LinkEdit/FormHeader'
import styles from '../../../../LinkEdit/LinkEdit.module.scss'

interface LinkEditFormProps {
	link: LinkItem
	onSave: (data: LinkEditFormData) => void
	onCancel: () => void
	onChange?: (data: LinkEditFormData, isDirty: boolean) => void
	isLoading?: boolean
	mode?: 'edit' | 'create'
}

export default function LinkEditForm({
	link,
	onSave,
	onCancel,
	onChange,
	isLoading = false,
	mode = 'edit'
}: LinkEditFormProps) {
	const isCreateMode = mode === 'create'

	const {
		formData,
		errors,
		touched,
		isDirty,
		advancedOpen,
		aliasCheck,
		handleFieldChange,
		handleDestinationError,
		handleExpirationChange,
		handleClearExpiration,
		handlePasswordToggle,
		validateForm,
		getNormalizedData,
		initialData
	} = useLinkForm({ link, onChange })

	const handleSubmit = useCallback(
		(e: { preventDefault: () => void }) => {
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
			/>
			<AdvancedSettings
				expirationDate={formData.expirationDate}
				expirationError={errors.expirationDate}
				passwordEnabled={formData.passwordEnabled}
				password={formData.password}
				passwordError={errors.password}
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
