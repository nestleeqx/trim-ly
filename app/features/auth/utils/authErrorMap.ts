type AuthMappedError = {
	message: string
	field?: 'email' | 'password' | 'confirmPassword' | 'token'
}

export function mapAuthApiError(
	rawError: string,
	fallback = 'Произошла ошибка. Попробуйте снова.'
): AuthMappedError {
	switch (rawError) {
		case 'Unauthorized':
			return { message: 'Сессия истекла. Войдите снова.' }

		case 'Invalid credentials':
		case 'CredentialsSignin':
			return { message: 'Неверный email или пароль.' }

		case 'Missing fields':
			return { message: 'Заполните все обязательные поля.' }

		case 'Email already exists':
		case 'User already exists':
			return {
				field: 'email',
				message: 'Этот email уже зарегистрирован.'
			}

		case 'Invalid email':
			return { field: 'email', message: 'Введите корректный email.' }

		case 'Password must be at least 8 characters':
			return {
				field: 'password',
				message: 'Пароль должен быть не короче 8 символов.'
			}

		case 'Invalid token':
			return { field: 'token', message: 'Ссылка недействительна.' }

		case 'Token expired':
			return { field: 'token', message: 'Срок действия ссылки истёк.' }

		case 'Token already used':
			return { field: 'token', message: 'Ссылка уже использована.' }

		case 'Too many requests. Try again later.':
			return { message: 'Слишком много попыток. Попробуйте позже.' }

		default:
			return { message: rawError || fallback }
	}
}
