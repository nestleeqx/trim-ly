import { authOptions } from '@/auth'
import { del, put } from '@vercel/blob'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const MAX_AVATAR_SIZE_BYTES = 2 * 1024 * 1024

function isBlobUrl(value: string) {
	try {
		const url = new URL(value)
		return (
			(url.protocol === 'http:' || url.protocol === 'https:') &&
			url.hostname.includes('.blob.vercel-storage.com')
		)
	} catch {
		return false
	}
}

function getFileExtension(type: string) {
	switch (type) {
		case 'image/png':
			return 'png'
		case 'image/webp':
			return 'webp'
		default:
			return 'jpg'
	}
}

export async function POST(req: Request) {
	const session = await getServerSession(authOptions)
	const userId = session?.user?.id

	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	if (!process.env.BLOB_READ_WRITE_TOKEN) {
		return NextResponse.json(
			{ error: 'Blob storage is not configured' },
			{ status: 500 }
		)
	}

	const formData = await req.formData().catch(() => null)
	const file = formData?.get('file')

	if (!(file instanceof File)) {
		return NextResponse.json(
			{ error: 'Avatar file is required' },
			{ status: 400 }
		)
	}

	if (!ALLOWED_MIME_TYPES.has(file.type)) {
		return NextResponse.json(
			{ error: 'Invalid avatar file type' },
			{ status: 400 }
		)
	}

	if (file.size > MAX_AVATAR_SIZE_BYTES) {
		return NextResponse.json(
			{ error: 'Avatar file is too large' },
			{ status: 400 }
		)
	}

	const previous = await prisma.user.findUnique({
		where: { id: userId },
		select: { avatarURL: true }
	})

	const extension = getFileExtension(file.type)
	const pathname = `avatars/${userId}/${Date.now()}-${randomUUID()}.${extension}`

	const uploaded = await put(pathname, file, {
		access: 'public',
		addRandomSuffix: false
	})

	const updated = await prisma.user.update({
		where: { id: userId },
		data: { avatarURL: uploaded.url },
		select: { avatarURL: true }
	})

	if (previous?.avatarURL && isBlobUrl(previous.avatarURL)) {
		void del(previous.avatarURL).catch(() => undefined)
	}

	return NextResponse.json(updated)
}

export async function DELETE() {
	const session = await getServerSession(authOptions)
	const userId = session?.user?.id

	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: { avatarURL: true }
	})

	await prisma.user.update({
		where: { id: userId },
		data: { avatarURL: null }
	})

	if (user?.avatarURL && isBlobUrl(user.avatarURL)) {
		void del(user.avatarURL).catch(() => undefined)
	}

	return NextResponse.json({ ok: true })
}
