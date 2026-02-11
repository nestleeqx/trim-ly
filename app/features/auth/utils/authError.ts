export function getAuthErrorMessage(code: string | null) {
	if (!code) return null

	switch (code) {
		case 'OAuthAccountNotLinked':
			return 'Этот email уже зарегистрирован. Войдите с помощью пароля и попробуйте снова, либо используйте тот же способ входа, что и при регистрации.'
		case 'AccessDenied':
			return 'Доступ отклонён. Разрешите доступ в окне провайдера и попробуйте ещё раз.'
		case 'Configuration':
			return 'Ошибка конфигурации входа. Проверьте настройки приложения.'
		case 'OAuthCallback':
		case 'Callback':
			return 'Не удалось завершить вход. Попробуйте ещё раз.'
		case 'CredentialsSignin':
			return 'Неверный email или пароль.'
		default:
			return 'Не удалось выполнить вход. Попробуйте ещё раз.'
	}
}
