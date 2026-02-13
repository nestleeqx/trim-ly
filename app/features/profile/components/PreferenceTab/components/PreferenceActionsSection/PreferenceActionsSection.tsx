import Button from '@/app/components/ui/Button/Button'
import stylesCommon from '../../../settingsCommon.module.scss'

type Props = {
	isVisible: boolean
	isSaving: boolean
	onSave: () => void
}

export default function PreferenceActionsSection({
	isVisible,
	isSaving,
	onSave
}: Props) {
	return (
		<div className={stylesCommon.actionsRow}>
			{isVisible && (
				<Button
					variant='primary'
					onClick={onSave}
					disabled={isSaving}
				>
					{isSaving ? 'Сохраняем...' : 'Сохранить оформление'}
				</Button>
			)}
		</div>
	)
}
