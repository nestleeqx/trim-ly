import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const AUTH_PAGES = new Set([
	'/login',
	'/signup',
	'/forgot-password',
	'/reset-password',
	'/check-email'
])

const MANAGER_PREFIXES = [
	'/dashboard',
	'/analytics',
	'/links',
	'/pricing',
	'/settings'
]

function isManagerPath(pathname: string): boolean {
	return MANAGER_PREFIXES.some(
		prefix => pathname === prefix || pathname.startsWith(`${prefix}/`)
	)
}

export async function middleware(req: NextRequest) {
	const { pathname, search } = req.nextUrl
	const searchParams = req.nextUrl.searchParams

	const isAuthPage = AUTH_PAGES.has(pathname)
	const isProtectedPath = isManagerPath(pathname)

	if (!isAuthPage && !isProtectedPath) {
		return NextResponse.next()
	}

	const token = await getToken({
		req,
		secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET
	})

	if (!token && isProtectedPath) {
		const loginUrl = new URL('/login', req.url)
		loginUrl.searchParams.set('callbackUrl', `${pathname}${search}`)
		return NextResponse.redirect(loginUrl)
	}

	if (pathname === '/check-email') {
		const flow = searchParams.get('flow')
		const email = searchParams.get('email')
		const isAllowedFlow = flow === 'forgot' || flow === 'signup'

		if (!isAllowedFlow || !email) {
			return NextResponse.redirect(new URL('/forgot-password', req.url))
		}
	}

	if (pathname === '/reset-password') {
		const resetToken = searchParams.get('token')
		if (!resetToken) {
			return NextResponse.redirect(new URL('/forgot-password', req.url))
		}
	}

	if (token && isAuthPage) {
		return NextResponse.redirect(new URL('/dashboard', req.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: [
		'/((?!api|_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|.*\\..*).*)'
	]
}
