export type ResetPasswordValues = {
	password: string
	confirmPassword: string
}

export type ResetPasswordErrors = Partial<
	Record<keyof ResetPasswordValues, string>
>

export function validateResetPassword(
	values: ResetPasswordValues
): ResetPasswordErrors {
	const errors: ResetPasswordErrors = {}

	const password = values.password
	const confirmPassword = values.confirmPassword

	if (!password) errors.password = 'Введите пароль.'
	else if (password.length < 8) errors.password = 'Минимум 8 символов.'
	else if (password.length > 128) errors.password = 'Слишком длинный пароль.'

	if (!confirmPassword) errors.confirmPassword = 'Подтвердите пароль.'
	else if (confirmPassword !== password)
		errors.confirmPassword = 'Пароли не совпадают.'

	return errors
}

export function hasErrors(errors: ResetPasswordErrors) {
	return Object.keys(errors).length > 0
}
