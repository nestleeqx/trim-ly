'use client'

import Button from '@/app/components/ui/Button/Button'
import styles from './LinkEdit.module.scss'

interface FormActionsProps {
	onCancel: () => void
	isLoading: boolean
	isCreateMode: boolean
	canSubmit: boolean
}

export default function FormActions({
	onCancel,
	isLoading,
	isCreateMode,
	canSubmit
}: FormActionsProps) {
	return (
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
	)
}
