export type ProfileKnownField =
	| 'name'
	| 'username'
	| 'currentPassword'
	| 'newPassword'
	| 'confirmPassword'
	| 'password'
	| 'theme'
	| 'avatarURL'

type MappedError = {
	message: string
	field?: ProfileKnownField
}

export function mapProfileApiError(
	rawError: string,
	fallback = 'Произошла ошибка. Попробуйте снова.'
): MappedError {
	switch (rawError) {
		case 'Unauthorized':
			return { message: 'Сессия истекла. Войдите снова.' }

		case 'User not found':
			return { message: 'Пользователь не найден.' }

		case 'Request failed':
			return { message: fallback }

		case 'Validation error':
			return { message: 'Проверьте корректность введённых данных.' }

		case 'Username already taken':
			return {
				field: 'username',
				message: 'Имя пользователя уже занято.'
			}

		case 'avatarURL is required':
			return {
				field: 'avatarURL',
				message: 'Укажите ссылку на изображение.'
			}

		case 'Invalid avatar URL':
			return {
				field: 'avatarURL',
				message: 'Некорректная ссылка на изображение.'
			}

		case 'Invalid credentials':
			return {
				field: 'currentPassword',
				message: 'Неверный текущий пароль.'
			}

		case 'Missing fields':
			return { message: 'Заполните все обязательные поля.' }

		case 'Invalid new password':
			return {
				field: 'newPassword',
				message: 'Новый пароль не соответствует требованиям.'
			}

		case 'New password must differ from current password':
			return {
				field: 'newPassword',
				message: 'Новый пароль должен отличаться от текущего.'
			}

		case 'Password is required':
			return { field: 'password', message: 'Введите пароль.' }

		case 'Invalid password':
			return { field: 'password', message: 'Неверный пароль.' }

		case 'Invalid theme value':
			return { field: 'theme', message: 'Некорректное значение темы.' }

		case 'Too many requests. Try again later.':
			return { message: 'Слишком много попыток. Попробуйте позже.' }

		default:
			return { message: rawError || fallback }
	}
}
