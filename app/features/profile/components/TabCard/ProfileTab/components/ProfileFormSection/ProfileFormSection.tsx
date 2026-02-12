import FormField from '@/app/features/auth/components/FormContent/FormField'
import stylesCommon from '../../../settingsCommon.module.scss'

type FieldErrors = Partial<Record<'name' | 'username', string>>

type Props = {
	fullName: string
	username: string
	email: string
	fieldErrors: FieldErrors
	onFullNameChange: (value: string) => void
	onUsernameChange: (value: string) => void
}

export default function ProfileFormSection({
	fullName,
	username,
	email,
	fieldErrors,
	onFullNameChange,
	onUsernameChange
}: Props) {
	return (
		<>
			<div className={stylesCommon.formGroup}>
				<FormField
					id='fullname'
					label='полное имя'
					labelStyle='secondary'
					type='text'
					placeholder='Ваше имя'
					value={fullName}
					onChange={e => onFullNameChange(e.target.value)}
					autoComplete='fullname'
					error={fieldErrors.name}
				/>
				<FormField
					id='username'
					label='имя пользователя'
					labelStyle='secondary'
					type='text'
					placeholder='Ваше @имя_пользователя'
					value={username}
					onChange={e => onUsernameChange(e.target.value)}
					autoComplete='username'
					error={fieldErrors.username}
				/>
			</div>

			<div className={stylesCommon.formSingle}>
				<FormField
					id='email'
					label='электронная почта'
					labelStyle='secondary'
					type='email'
					placeholder='Ваша электронная почта'
					value={email}
					autoComplete='email'
					disabled={true}
				/>
				<div className={stylesCommon.hint}>
					Email нельзя изменить вручную.
				</div>
			</div>
		</>
	)
}
