import 'server-only'

type Entry = { count: number; resetAt: number }

const store = new Map<string, Entry>()

export function rateLimit(params: {
	key: string
	limit: number
	windowMs: number
}) {
	const now = Date.now()
	const entry = store.get(params.key)

	if (!entry || entry.resetAt <= now) {
		const next: Entry = { count: 1, resetAt: now + params.windowMs }
		store.set(params.key, next)
		return { ok: true, remaining: params.limit - 1, resetAt: next.resetAt }
	}

	if (entry.count >= params.limit) {
		return { ok: false, remaining: 0, resetAt: entry.resetAt }
	}

	entry.count += 1
	store.set(params.key, entry)
	return {
		ok: true,
		remaining: params.limit - entry.count,
		resetAt: entry.resetAt
	}
}

export function cleanupRateLimitStore() {
	const now = Date.now()
	for (const [k, v] of store.entries()) {
		if (v.resetAt <= now) store.delete(k)
	}
}
