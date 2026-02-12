import Button from '@/app/components/ui/Button/Button'
import stylesCommon from '../../../settingsCommon.module.scss'

type Props = {
	isSaving: boolean
	hasProfileChanges: boolean
	isError: boolean
	onSave: () => void
}

export default function ProfileActionsSection({
	isSaving,
	hasProfileChanges,
	isError = false,
	onSave
}: Props) {
	return (
		<div className={stylesCommon.actionsRow}>
			{hasProfileChanges && (
				<Button
					variant='primary'
					size='md'
					onClick={onSave}
					disabled={isSaving || isError}
				>
					{isSaving ? 'Сохраняем...' : 'Сохранить изменения'}
				</Button>
			)}
		</div>
	)
}
