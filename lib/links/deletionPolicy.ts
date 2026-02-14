const DEFAULT_RETENTION_DAYS = 30

function parsePositiveInt(value: string | undefined, fallback: number) {
	if (!value) return fallback
	const parsed = Number.parseInt(value, 10)
	if (!Number.isFinite(parsed) || parsed <= 0) return fallback
	return parsed
}

export function getSoftDeleteRetentionDays() {
	return parsePositiveInt(
		process.env.LINK_SOFT_DELETE_RETENTION_DAYS,
		DEFAULT_RETENTION_DAYS
	)
}

export function getSoftDeleteCutoffDate(now = new Date()) {
	const days = getSoftDeleteRetentionDays()
	const cutoff = new Date(now)
	cutoff.setDate(cutoff.getDate() - days)
	return cutoff
}

export function getDeletionPlannedAt(deletedAt: Date) {
	const days = getSoftDeleteRetentionDays()
	const planned = new Date(deletedAt)
	planned.setDate(planned.getDate() + days)
	return planned
}
