import { headers } from 'next/headers'
import 'server-only'

export async function getRequestIp() {
	const h = headers()
	const xff = (await h).get('x-forwarded-for')
	if (xff) return xff.split(',')[0].trim()
	return (await h).get('x-real-ip') ?? 'unknown'
}
