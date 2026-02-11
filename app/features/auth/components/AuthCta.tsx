'use client'

import Button from '@/app/components/ui/Button/Button'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { ReactNode } from 'react'

type ButtonVariant =
	| 'primary'
	| 'invertPrimary'
	| 'secondary'
	| 'ghost'
	| 'invertGhost'
	| 'outline'
	| 'invertOutline'

type ButtonSize = 'sm' | 'md' | 'lg'

interface AuthCtaProps {
	showLoginForGuest?: boolean
	onActionClick?: () => void
	loginHref?: string
	loginText?: string
	loginVariant?: ButtonVariant
	loginSize?: ButtonSize
	loginLinkClassName?: string
	loginButtonClassName?: string
	primaryGuestHref?: string
	primaryGuestText?: string
	primaryGuestVariant?: ButtonVariant
	primaryGuestSize?: ButtonSize
	primaryGuestSuffix?: ReactNode
	primaryGuestLinkClassName?: string
	primaryGuestButtonClassName?: string
	authenticatedHref?: string
	authenticatedText?: string
	authenticatedVariant?: ButtonVariant
	authenticatedSize?: ButtonSize
	authenticatedSuffix?: ReactNode
	authenticatedLinkClassName?: string
	authenticatedButtonClassName?: string
}

export default function AuthCta({
	showLoginForGuest = true,
	onActionClick,
	loginHref = '/login',
	loginText = 'Login',
	loginVariant = 'ghost',
	loginSize = 'sm',
	loginLinkClassName,
	loginButtonClassName,
	primaryGuestHref = '/signup',
	primaryGuestText = 'Create account',
	primaryGuestVariant = 'primary',
	primaryGuestSize = 'sm',
	primaryGuestSuffix,
	primaryGuestLinkClassName,
	primaryGuestButtonClassName,
	authenticatedHref = '/dashboard',
	authenticatedText = 'Open dashboard',
	authenticatedVariant = 'primary',
	authenticatedSize = 'sm',
	authenticatedSuffix,
	authenticatedLinkClassName,
	authenticatedButtonClassName
}: AuthCtaProps) {
	const { status } = useSession()
	const isAuthenticated = status === 'authenticated'

	if (isAuthenticated) {
		return (
			<Link
				href={authenticatedHref}
				className={authenticatedLinkClassName}
				onClick={onActionClick}
			>
				<Button
					variant={authenticatedVariant}
					size={authenticatedSize}
					className={authenticatedButtonClassName}
				>
					{authenticatedText}
					{authenticatedSuffix}
				</Button>
			</Link>
		)
	}

	return (
		<>
			{showLoginForGuest && (
				<Link
					href={loginHref}
					className={loginLinkClassName}
					onClick={onActionClick}
				>
					<Button
						variant={loginVariant}
						size={loginSize}
						className={loginButtonClassName}
					>
						{loginText}
					</Button>
				</Link>
			)}
			<Link
				href={primaryGuestHref}
				className={primaryGuestLinkClassName}
				onClick={onActionClick}
			>
				<Button
					variant={primaryGuestVariant}
					size={primaryGuestSize}
					className={primaryGuestButtonClassName}
				>
					{primaryGuestText}
					{primaryGuestSuffix}
				</Button>
			</Link>
		</>
	)
}
