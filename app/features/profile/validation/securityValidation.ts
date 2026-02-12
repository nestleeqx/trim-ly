export type ChangePasswordErrors = Partial<
	Record<'currentPassword' | 'newPassword' | 'confirmPassword', string>
>

export function getPasswordStrength(password: string) {
	let score = 0

	if (password.length >= 8) score++
	if (/[a-z]/.test(password)) score++
	if (/[A-Z]/.test(password)) score++
	if (/\d/.test(password)) score++
	if (/[^A-Za-z0-9]/.test(password)) score++

	if (score <= 1) return { score, label: 'Слабый', tone: 'weak' as const }
	if (score <= 3) return { score, label: 'Средний', tone: 'medium' as const }
	return { score, label: 'Сильный', tone: 'strong' as const }
}

export function validateChangePassword(values: {
	currentPassword: string
	newPassword: string
	confirmPassword: string
}): ChangePasswordErrors {
	const errors: ChangePasswordErrors = {}

	const currentPassword = values.currentPassword
	const newPassword = values.newPassword
	const confirmPassword = values.confirmPassword

	if (!currentPassword) {
		errors.currentPassword = 'Введите текущий пароль.'
	}

	if (!newPassword) {
		errors.newPassword = 'Введите новый пароль.'
	} else if (newPassword.length < 8) {
		errors.newPassword = 'Минимум 8 символов.'
	} else if (newPassword.length > 128) {
		errors.newPassword = 'Слишком длинный пароль.'
	}

	if (newPassword && currentPassword && newPassword === currentPassword) {
		errors.newPassword = 'Новый пароль должен отличаться от текущего.'
	}

	if (!confirmPassword) {
		errors.confirmPassword = 'Подтвердите новый пароль.'
	} else if (newPassword !== confirmPassword) {
		errors.confirmPassword = 'Пароли не совпадают.'
	}

	return errors
}
