import type React from 'react'

type BaseProps = {
	id: string
	label: string
	labelAccessory?: React.ReactNode
	error?: string
	hint?: string
	required?: boolean
	disabled?: boolean
	className?: string
	labelClassName?: string
	inputClassName?: string
	leftIcon?: React.ReactNode
	rightAdornment?: React.ReactNode
}

export type InputVariantProps = BaseProps & {
	as?: 'input'
	type?: React.HTMLInputTypeAttribute
	value?: string
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
	onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
	placeholder?: string
	name?: string
	autoComplete?: string
	inputProps?: React.InputHTMLAttributes<HTMLInputElement>
}

export type TextareaVariantProps = BaseProps & {
	as: 'textarea'
	value?: string
	onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
	onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void
	placeholder?: string
	name?: string
	rows?: number
	autoComplete?: string
	textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>
}

export type FormFieldProps = InputVariantProps | TextareaVariantProps
