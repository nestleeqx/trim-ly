import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import YandexProvider from 'next-auth/providers/yandex'
import { generateUniqueUsername } from './lib/auth'

const ONE_DAY = 60 * 60 * 24
const THIRTY_DAYS = 60 * 60 * 24 * 30

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
					image: user.avatarURL ?? undefined,
					remember
				} as any
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

			const pickBase = () => {
				const p: any = profile ?? {}
				return (
					(provider === 'yandex' && (p.login || p.display_name)) ||
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

				;(user as any).dbId = byProvider.id
				return true
			}

			if (email) {
				const byEmail = await prisma.user.findUnique({
					where: { email }
				})

				if (byEmail) {
					const dataToUpdate: any = {
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
					;(user as any).dbId = byEmail.id
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
			;(user as any).dbId = created.id
			return true
		},

		async jwt({ token, user }) {
			const now = Math.floor(Date.now() / 1000)

			if (user) {
				token.userId = (user as any).dbId ?? user.id
				token.remember = (user as any).remember ?? false
				token.exp =
					now + ((token as any).remember ? THIRTY_DAYS : ONE_DAY)
				return token
			}

			if (typeof token.exp === 'number' && token.exp < now) {
				// токен истёк — заставляем next-auth считать сессию невалидной
				return {} as any
			}

			if (typeof token.exp !== 'number') {
				token.exp = now + THIRTY_DAYS
			}

			return token
		},
		async session({ session, token }) {
			if (session.user) {
				// @ts-expect-error расширяем тип
				session.user.id = token.userId as string
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
