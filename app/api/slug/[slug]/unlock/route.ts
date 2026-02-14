import { registerPublicClick, resolvePublicLink } from '@/lib/links/publicLink'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

type RouteContext = {
	params: Promise<{ slug: string }>
}

export async function POST(req: Request, context: RouteContext) {
	try {
		const { slug } = await context.params
		const body = await req.json().catch(() => null)
		const password = String(body?.password ?? '')

		if (!password) {
			return NextResponse.json({ error: 'Введите пароль' }, { status: 400 })
		}

		const resolved = await resolvePublicLink(slug)

		if (resolved.state === 'not-found') {
			return NextResponse.json(
				{ error: 'Ссылка не найдена' },
				{ status: 404 }
			)
		}
		if (resolved.state === 'paused') {
			return NextResponse.json(
				{ error: 'Ссылка временно отключена' },
				{ status: 409 }
			)
		}
		if (resolved.state === 'expired') {
			return NextResponse.json(
				{ error: 'Срок ссылки истек' },
				{ status: 409 }
			)
		}

		if (resolved.state === 'redirect') {
			try {
				await registerPublicClick({
					linkId: resolved.link.id,
					userId: resolved.link.userId,
					headers: req.headers
				})
			} catch {}

			return NextResponse.json({ targetUrl: resolved.link.targetUrl })
		}

		const isValid = await bcrypt.compare(password, resolved.link.passwordHash)
		if (!isValid) {
			return NextResponse.json({ error: 'Неверный пароль' }, { status: 401 })
		}

		try {
			await registerPublicClick({
				linkId: resolved.link.id,
				userId: resolved.link.userId,
				headers: req.headers
			})
		} catch {}

		return NextResponse.json({ targetUrl: resolved.link.targetUrl })
	} catch {
		return NextResponse.json(
			{ error: 'Не удалось обработать запрос' },
			{ status: 500 }
		)
	}
}
