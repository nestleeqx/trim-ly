export function isAbortError(error: unknown): boolean {
	if (error instanceof DOMException && error.name === 'AbortError') {
		return true
	}

	if (error instanceof Error && /aborted|abort/i.test(error.message)) {
		return true
	}

	return false
}

