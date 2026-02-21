import type { Prisma } from '@/app/generated/prisma/client'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import type { NextAuthOptions, Profile } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import YandexProvider from 'next-auth/providers/yandex'
import { generateUniqueUsername } from './lib/auth'

const ONE_DAY = 60 * 60 * 24
const THIRTY_DAYS = 60 * 60 * 24 * 30

type AuthUserMeta = {
	dbId?: string
	remember?: boolean
}

type JwtMeta = JWT & {
	userId?: string
	remember?: boolean
}

function getOAuthBaseName(
	profile: Profile | undefined,
	fallback: string
): string {
	const p = (profile ?? {}) as Record<string, unknown>
	const login = typeof p.login === 'string' ? p.login : ''
	const displayName = typeof p.display_name === 'string' ? p.display_name : ''

	return login || displayName || fallback
}

export const authOptions: NextAuthOptions = {
	session: { strategy: 'jwt', maxAge: THIRTY_DAYS },
	jwt: { maxAge: THIRTY_DAYS },
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' },
				remember: { label: 'Remember', type: 'text' }
			},
			async authorize(credentials) {
				const email = credentials?.email
				const password = credentials?.password
				const remember = credentials?.remember === '1'

				if (!email || !password) return null

				const user = await prisma.user.findUnique({
					where: { email: email.trim().toLowerCase() }
				})
				if (!user?.passwordHash) return null

				const ok = await bcrypt.compare(password, user.passwordHash)
				if (!ok) return null

				return {
					id: user.id,
					email: user.email,
					name: user.name ?? user.username ?? undefined,
					image: user.avatarURL
						? `/api/profile/personal-data/avatar?uid=${user.id}`
						: undefined,
					dbId: user.id,
					remember
				}
			}
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_ID!,
			clientSecret: process.env.GOOGLE_SECRET!
		}),
		YandexProvider({
			clientId: process.env.YANDEX_ID!,
			clientSecret: process.env.YANDEX_SECRET!
		})
	],
	callbacks: {
		async signIn({ user, account, profile }) {
			if (!account || account.type === 'credentials') return true

			const provider = account.provider
			const providerId = account.providerAccountId
			const email = (user.email ?? '').trim().toLowerCase() || null
			const userWithMeta = user as typeof user & AuthUserMeta

			const pickBase = () => {
				const baseFromOAuth =
					provider === 'yandex' ? getOAuthBaseName(profile, '') : ''
				return (
					baseFromOAuth ||
					user.name ||
					(email ? email.split('@')[0] : 'user')
				)
			}

			const byProvider = await prisma.user.findFirst({
				where: { provider, providerId }
			})

			if (byProvider) {
				if (!byProvider.username) {
					const username = await generateUniqueUsername(
						String(pickBase())
					)
					await prisma.user.update({
						where: { id: byProvider.id },
						data: { username }
					})
				}

				userWithMeta.dbId = byProvider.id
				return true
			}

			if (email) {
				const byEmail = await prisma.user.findUnique({
					where: { email }
				})

				if (byEmail) {
					const dataToUpdate: Prisma.UserUpdateInput = {
						provider,
						providerId,
						emailVerified: byEmail.emailVerified ?? new Date(),
						avatarURL: byEmail.avatarURL ?? user.image ?? null,
						name: byEmail.name ?? user.name ?? null
					}

					if (!byEmail.username) {
						dataToUpdate.username = await generateUniqueUsername(
							String(pickBase())
						)
					}

					await prisma.user.update({
						where: { id: byEmail.id },
						data: dataToUpdate
					})
					userWithMeta.dbId = byEmail.id
					return true
				}
			}

			const username = await generateUniqueUsername(String(pickBase()))

			const created = await prisma.user.create({
				data: {
					email:
						email ??
						`no-email-${provider}-${providerId}@example.local`,
					name: user.name ?? null,
					avatarURL: user.image ?? null,
					username,
					provider,
					providerId,
					emailVerified: email ? new Date() : null,
					planId: 'free',
					subscriptionStatus: 'active'
				}
			})

			await prisma.userUsage.create({ data: { userId: created.id } })
			userWithMeta.dbId = created.id
			return true
		},

		async jwt({ token, user, trigger, session }) {
			const now = Math.floor(Date.now() / 1000)
			const tokenWithMeta = token as JwtMeta

			if (user) {
				const userWithMeta = user as typeof user & AuthUserMeta
				tokenWithMeta.userId = userWithMeta.dbId ?? user.id
				tokenWithMeta.remember = userWithMeta.remember ?? false
				tokenWithMeta.exp =
					now + (tokenWithMeta.remember ? THIRTY_DAYS : ONE_DAY)
				return tokenWithMeta
			}

			if (trigger === 'update' && session) {
				if (typeof session.name === 'string')
					tokenWithMeta.name = session.name
				if (typeof session.image === 'string')
					tokenWithMeta.picture = session.image
				if (session.image === null) delete tokenWithMeta.picture
			}

			if (
				typeof tokenWithMeta.exp === 'number' &&
				tokenWithMeta.exp < now
			) {
				return {} as typeof token
			}

			if (typeof tokenWithMeta.exp !== 'number') {
				tokenWithMeta.exp = now + THIRTY_DAYS
			}

			return tokenWithMeta
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = ((token as JwtMeta).userId ?? '') as string
				if (typeof token.name === 'string')
					session.user.name = token.name
				if (typeof token.email === 'string')
					session.user.email = token.email
				if (typeof token.picture === 'string') {
					session.user.image = token.picture
				} else {
					session.user.image = null
				}
			}

			if (typeof token.exp === 'number') {
				session.expires = new Date(token.exp * 1000).toISOString()
			}

			return session
		}
	},
	pages: {
		signIn: '/login',
		error: '/login'
	}
}
