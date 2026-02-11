export type LoginValues = {
	email: string
	password: string
}

export type LoginErrors = Partial<Record<keyof LoginValues, string>>

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateLogin(values: LoginValues): LoginErrors {
	const errors: LoginErrors = {}

	const email = values.email.trim().toLowerCase()
	const password = values.password

	if (!email) errors.email = 'Введите email.'
	else if (!emailRegex.test(email)) errors.email = 'Некорректный email.'

	if (!password) errors.password = 'Введите пароль.'

	return errors
}

export function hasErrors(errors: LoginErrors) {
	return Object.keys(errors).length > 0
}
