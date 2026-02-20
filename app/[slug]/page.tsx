import styles from '@/app/[slug]/page.module.scss'
import Logo from '@/app/components/ui/Logo/Logo'
import ExpiredState from '@/app/features/slug/components/ExpiredState'
import PasswordState from '@/app/features/slug/components/PasswordState'
import PausedState from '@/app/features/slug/components/PausedState'
import { registerPublicClick, resolvePublicLink } from '@/lib/links/publicLink'
import { ShieldCheck } from 'lucide-react'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'

interface SlugPageProps {
	params: Promise<{
		slug: string
	}>
	searchParams: Promise<{
		src?: string
	}>
}

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
	title: 'Переход по ссылке',
	description: 'Служебная страница перехода по короткой ссылке.',
	robots: {
		index: false,
		follow: false,
		noarchive: true
	}
}

export default async function SlugPage({
	params,
	searchParams
}: SlugPageProps) {
	const { slug } = await params
	const { src } = await searchParams

	let resolved: Awaited<ReturnType<typeof resolvePublicLink>>
	try {
		resolved = await resolvePublicLink(slug)
	} catch {
		notFound()
	}

	if (resolved.state === 'not-found') {
		notFound()
	}

	if (resolved.state === 'redirect') {
		try {
			const requestHeaders = await headers()
			await registerPublicClick({
				linkId: resolved.link.id,
				userId: resolved.link.userId,
				headers: requestHeaders,
				source: src
			})
		} catch {}

		redirect(resolved.link.targetUrl)
	}

	return (
		<div className={styles.page}>
			<div className={styles.logo}>
				<Logo />
			</div>

			{resolved.state === 'password' ? <PasswordState slug={slug} /> : null}
			{resolved.state === 'paused' ? <PausedState /> : null}
			{resolved.state === 'expired' ? <ExpiredState /> : null}

			<div className={styles.footer}>
				<ShieldCheck size={14} />
				<span>Защищено trim.ly</span>
			</div>
		</div>
	)
}
