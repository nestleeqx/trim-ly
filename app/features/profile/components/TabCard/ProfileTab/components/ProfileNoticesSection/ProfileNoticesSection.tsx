import NoticeBanner from '@/app/components/ui/NoticeBanner/NoticeBanner'
import stylesCommon from '../../../settingsCommon.module.scss'

type Props = {
	error: string | null
	success: string | null
}

export default function ProfileNoticesSection({ error, success }: Props) {
	return (
		<div className={stylesCommon.notices}>
			<NoticeBanner
				message={error}
				type='error'
			/>
			<NoticeBanner
				message={success}
				type='success'
			/>
		</div>
	)
}
