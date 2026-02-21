import { authOptions } from '@/auth'
import prisma from '@/lib/prisma'
import { del, get, put } from '@vercel/blob'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import { lookup } from 'node:dns/promises'
import net from 'node:net'

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const MAX_AVATAR_SIZE_BYTES = 2 * 1024 * 1024
const REMOTE_FETCH_TIMEOUT_MS = 8_000

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

function isValidHttpUrl(value: string) {
	try {
		const url = new URL(value)
		if (url.protocol !== 'http:' && url.protocol !== 'https:') return false
		if (url.username || url.password) return false
		return true
	} catch {
		return false
	}
}

function isPrivateIpv4(ip: string) {
	const parts = ip.split('.').map(Number)
	if (parts.length !== 4 || parts.some(part => Number.isNaN(part)))
		return true
	const [a, b] = parts
	return (
		a === 10 ||
		a === 127 ||
		(a === 169 && b === 254) ||
		(a === 172 && b >= 16 && b <= 31) ||
		(a === 192 && b === 168)
	)
}

function isPrivateIpv6(ip: string) {
	const normalized = ip.toLowerCase()
	return (
		normalized === '::1' ||
		normalized.startsWith('fc') ||
		normalized.startsWith('fd') ||
		normalized.startsWith('fe80:')
	)
}

function isPrivateAddress(address: string) {
	const family = net.isIP(address)
	if (family === 4) return isPrivateIpv4(address)
	if (family === 6) return isPrivateIpv6(address)
	return true
}

async function isSafePublicHost(hostname: string) {
	const normalized = hostname.trim().toLowerCase()
	if (!normalized) return false
	if (normalized === 'localhost' || normalized.endsWith('.localhost'))
		return false

	const literalIpFamily = net.isIP(normalized)
	if (literalIpFamily) return !isPrivateAddress(normalized)

	const addresses = await lookup(normalized, {
		all: true,
		verbatim: true
	}).catch(() => [])
	if (!addresses.length) return false

	return addresses.every(record => !isPrivateAddress(record.address))
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

async function uploadAvatarFile(params: {
	userId: string
	file: File
	previousAvatarURL: string | null
}) {
	const { userId, file, previousAvatarURL } = params
	const extension = getFileExtension(file.type)
	const pathname = `avatars/${userId}/${Date.now()}-${randomUUID()}.${extension}`

	const uploaded = await put(pathname, file, {
		access: 'private',
		addRandomSuffix: false
	})

	try {
		const updated = await prisma.user.update({
			where: { id: userId },
			data: { avatarURL: uploaded.url },
			select: { avatarURL: true }
		})

		if (previousAvatarURL && isBlobUrl(previousAvatarURL)) {
			void del(previousAvatarURL).catch(() => undefined)
		}

		return updated
	} catch (error) {
		if (uploaded.url) {
			void del(uploaded.url).catch(() => undefined)
		}
		throw error
	}
}

function validateAvatarFile(file: File) {
	if (!ALLOWED_MIME_TYPES.has(file.type)) {
		return 'Invalid avatar file type' as const
	}
	if (file.size > MAX_AVATAR_SIZE_BYTES) {
		return 'Avatar file is too large' as const
	}
	return null
}

async function createFileFromRemoteUrl(
	avatarURL: string
): Promise<{ file: File } | { error: string }> {
	if (!isValidHttpUrl(avatarURL)) {
		return { error: 'Invalid avatar URL' }
	}

	const parsedUrl = new URL(avatarURL)
	const safeHost = await isSafePublicHost(parsedUrl.hostname)
	if (!safeHost) {
		return { error: 'Avatar URL host is not allowed' }
	}

	const controller = new AbortController()
	const timeout = setTimeout(
		() => controller.abort(),
		REMOTE_FETCH_TIMEOUT_MS
	)

	const response = await fetch(avatarURL, {
		method: 'GET',
		cache: 'no-store',
		redirect: 'follow',
		signal: controller.signal
	})
		.catch(() => null)
		.finally(() => clearTimeout(timeout))

	if (!response?.ok || !response.body) {
		return { error: 'Invalid avatar URL' }
	}

	const contentLength = Number(response.headers.get('content-length') || '0')
	if (contentLength > MAX_AVATAR_SIZE_BYTES) {
		return { error: 'Avatar file is too large' }
	}

	const contentType =
		response.headers.get('content-type')?.split(';')[0] || ''
	if (!ALLOWED_MIME_TYPES.has(contentType)) {
		return { error: 'Invalid avatar file type' }
	}

	const reader = response.body.getReader()
	const chunks: Uint8Array[] = []
	let total = 0

	while (true) {
		const { done, value } = await reader.read()
		if (done) break
		if (!value) continue

		total += value.byteLength
		if (total > MAX_AVATAR_SIZE_BYTES) {
			void reader.cancel()
			return { error: 'Avatar file is too large' }
		}
		chunks.push(new Uint8Array(value))
	}

	const merged = new Uint8Array(total)
	let offset = 0
	for (const chunk of chunks) {
		merged.set(chunk, offset)
		offset += chunk.byteLength
	}

	const extension = getFileExtension(contentType)
	const fileName = `remote-${Date.now()}.${extension}`
	const file = new File([merged.buffer], fileName, { type: contentType })
	return { file }
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

	const previous = await prisma.user.findUnique({
		where: { id: userId },
		select: { avatarURL: true }
	})
	if (!previous) {
		return NextResponse.json({ error: 'User not found' }, { status: 404 })
	}

	const contentType = req.headers.get('content-type') || ''

	if (contentType.includes('multipart/form-data')) {
		const formData = await req.formData().catch(() => null)
		const file = formData?.get('file')
		if (!(file instanceof File)) {
			return NextResponse.json(
				{ error: 'Avatar file is required' },
				{ status: 400 }
			)
		}

		const fileError = validateAvatarFile(file)
		if (fileError) {
			return NextResponse.json({ error: fileError }, { status: 400 })
		}

		await uploadAvatarFile({
			userId,
			file,
			previousAvatarURL: previous.avatarURL
		})
		return NextResponse.json({
			avatarURL: `/api/profile/personal-data/avatar?uid=${userId}`
		})
	}

	const body = await req.json().catch(() => null)
	const avatarURL = String(body?.avatarURL ?? '').trim()
	if (!avatarURL) {
		return NextResponse.json(
			{ error: 'avatarURL is required' },
			{ status: 400 }
		)
	}

	const remote = await createFileFromRemoteUrl(avatarURL)
	if ('error' in remote) {
		return NextResponse.json({ error: remote.error }, { status: 400 })
	}

	const fileError = validateAvatarFile(remote.file)
	if (fileError) {
		return NextResponse.json({ error: fileError }, { status: 400 })
	}

	await uploadAvatarFile({
		userId,
		file: remote.file,
		previousAvatarURL: previous.avatarURL
	})
	return NextResponse.json({
		avatarURL: `/api/profile/personal-data/avatar?uid=${userId}`
	})
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
	if (!user) {
		return NextResponse.json({ error: 'User not found' }, { status: 404 })
	}

	await prisma.user.update({
		where: { id: userId },
		data: { avatarURL: null }
	})

	if (user.avatarURL && isBlobUrl(user.avatarURL)) {
		void del(user.avatarURL).catch(() => undefined)
	}

	return NextResponse.json({ ok: true })
}

export async function GET() {
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

	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: { avatarURL: true }
	})

	if (!user?.avatarURL) {
		return NextResponse.json({ error: 'Not found' }, { status: 404 })
	}

	const blob = await get(user.avatarURL, {
		access: 'private',
		token: process.env.BLOB_READ_WRITE_TOKEN
	}).catch(() => null)

	if (!blob || blob.statusCode !== 200 || !blob.stream) {
		return NextResponse.json({ error: 'Not found' }, { status: 404 })
	}

	return new NextResponse(blob.stream, {
		status: 200,
		headers: {
			'Content-Type': blob.blob.contentType || 'application/octet-stream',
			'Cache-Control': 'private, no-store, max-age=0, must-revalidate',
			Pragma: 'no-cache'
		}
	})
}
