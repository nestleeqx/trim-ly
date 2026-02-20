import BaseFormField from '@/app/components/ui/FormField'
import { usePasswordToggle } from '@/hooks/usePasswordToggle'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import styles from './FormContent.module.scss'

interface PasswordInputProps {
	id: string
	label: string
	labelStyle?: 'primary' | 'secondary'
	placeholder: string
	value: string
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	autoComplete?: string
	showForgotLink?: boolean
	forgotLinkHref?: string
	forgotLinkText?: string
	forgotLinkClassName?: string
	disabled?: boolean
	error?: string
}

export default function PasswordInput({
	id,
	label,
	labelStyle = 'primary',
	placeholder,
	value,
	onChange,
	autoComplete,
	showForgotLink = false,
	forgotLinkHref = '/forgot-password',
	forgotLinkText = 'Забыли пароль?',
	forgotLinkClassName,
	disabled = false,
	error
}: PasswordInputProps) {
	void labelStyle

	const { showPassword, togglePassword } = usePasswordToggle()

	const labelAccessory = showForgotLink ? (
		<Link
			href={forgotLinkHref}
			className={forgotLinkClassName}
		>
			{forgotLinkText}
		</Link>
	) : undefined

	return (
		<BaseFormField
			id={id}
			label={label}
			labelAccessory={labelAccessory}
			type={showPassword ? 'text' : 'password'}
			placeholder={placeholder}
			value={value}
			onChange={onChange}
			autoComplete={autoComplete}
			disabled={disabled}
			error={error}
			className={styles.formGroup}
			inputClassName={`${styles.input} ${styles.inputWithAdornment}`}
			rightAdornment={
				<button
					type='button'
					className={styles.passwordToggle}
					onClick={togglePassword}
					disabled={disabled}
					aria-label={
						showPassword ? 'Скрыть пароль' : 'Показать пароль'
					}
				>
					{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
				</button>
			}
		/>
	)
}
