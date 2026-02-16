export type RecentLinksConfirmAction =
	| 'delete'
	| 'pause'
	| 'resume'
	| 'restore'

interface ConfirmContent {
	title: string
	confirmText: string
	variant: 'danger' | 'warning'
	getMessage: (linkTitle: string) => string
	successToast: string
}

export const RECENT_LINKS_CONFIRM_CONTENT: Record<
	RecentLinksConfirmAction,
	ConfirmContent
> = {
	pause: {
		title: 'Приостановить ссылку',
		confirmText: 'Приостановить',
		variant: 'warning',
		getMessage: linkTitle =>
			`Вы уверены, что хотите приостановить ссылку "${linkTitle}"?`,
		successToast: 'Ссылка приостановлена'
	},
	resume: {
		title: 'Возобновить ссылку',
		confirmText: 'Возобновить',
		variant: 'warning',
		getMessage: linkTitle =>
			`Вы уверены, что хотите возобновить ссылку "${linkTitle}"?`,
		successToast: 'Ссылка возобновлена'
	},
	restore: {
		title: 'Восстановить ссылку',
		confirmText: 'Восстановить',
		variant: 'warning',
		getMessage: linkTitle =>
			`Вы уверены, что хотите восстановить ссылку "${linkTitle}"?`,
		successToast: 'Ссылка восстановлена'
	},
	delete: {
		title: 'Удалить ссылку',
		confirmText: 'Удалить',
		variant: 'danger',
		getMessage: linkTitle =>
			`Вы уверены, что хотите удалить ссылку "${linkTitle}"? Это действие необратимо.`,
		successToast: 'Ссылка удалена'
	}
}
