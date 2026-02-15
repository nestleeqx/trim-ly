import styles from '@/app/[slug]/page.module.scss'
import Logo from '@/app/components/ui/Logo/Logo'
import ErrorState from '@/app/features/slug/components/ErrorState'
import ExpiredState from '@/app/features/slug/components/ExpiredState'
import NotFoundState from '@/app/features/slug/components/NotFoundState'
import PasswordState from '@/app/features/slug/components/PasswordState'
import PausedState from '@/app/features/slug/components/PausedState'
import { registerPublicClick, resolvePublicLink } from '@/lib/links/publicLink'
import { ShieldCheck } from 'lucide-react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

interface SlugPageProps {
	params: Promise<{
		slug: string
	}>
	searchParams: Promise<{
		src?: string
	}>
}

export const dynamic = 'force-dynamic'

export default async function SlugPage({ params, searchParams }: SlugPageProps) {
	const { slug } = await params
	const { src } = await searchParams

	let resolved: Awaited<ReturnType<typeof resolvePublicLink>>
	try {
		resolved = await resolvePublicLink(slug)
	} catch {
		return (
			<div className={styles.page}>
				<div className={styles.logo}>
					<Logo />
				</div>
				<ErrorState />
				<div className={styles.footer}>
					<ShieldCheck size={14} />
					<span>Защищено trim.ly</span>
				</div>
			</div>
		)
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

			{resolved.state === 'password' ? (
				<PasswordState slug={slug} />
			) : null}
			{resolved.state === 'paused' ? <PausedState /> : null}
			{resolved.state === 'expired' ? <ExpiredState /> : null}
			{resolved.state === 'not-found' ? <NotFoundState /> : null}

			<div className={styles.footer}>
				<ShieldCheck size={14} />
				<span>Защищено trim.ly</span>
			</div>
		</div>
	)
}
