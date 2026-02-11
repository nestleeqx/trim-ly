export type SignupFormValues = {
	fullName: string
	email: string
	password: string
	agreeTerms: boolean
}

export type SignupFormErrors = Partial<
	Record<keyof SignupFormValues, string>
> & {
	form?: string
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateSignup(values: SignupFormValues): SignupFormErrors {
	const errors: SignupFormErrors = {}

	const fullName = values.fullName.trim()
	const email = values.email.trim().toLowerCase()
	const password = values.password

	if (!fullName) {
		errors.fullName = 'Введите имя.'
	} else if (fullName.length < 2) {
		errors.fullName = 'Слишком короткое имя.'
	} else if (fullName.length > 15) {
		errors.fullName = 'Слишком длинное имя.'
	}

	if (!email) {
		errors.email = 'Введите email.'
	} else if (!emailRegex.test(email)) {
		errors.email = 'Некорректный email.'
	}

	if (!password) {
		errors.password = 'Введите пароль.'
	} else if (password.length < 8) {
		errors.password = 'Пароль должен быть минимум 8 символов.'
	} else if (password.length > 128) {
		errors.password = 'Пароль слишком длинный.'
	}

	if (!values.agreeTerms) {
		errors.agreeTerms = 'Нужно согласиться с условиями.'
	}

	return errors
}

export function hasErrors(errors: SignupFormErrors) {
	return Object.keys(errors).length > 0
}
