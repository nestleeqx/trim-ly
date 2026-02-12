import cn from 'classnames'
import styles from './Skeleton.module.scss'

type SkeletonVariant = 'text' | 'rect' | 'circle'

type SkeletonProps = {
	className?: string
	variant?: SkeletonVariant
	width?: number | string
	height?: number | string
	radius?: number | string
}

export default function Skeleton({
	className,
	variant = 'rect',
	width,
	height,
	radius
}: SkeletonProps) {
	return (
		<div
			className={cn(styles.skeleton, styles[variant], className)}
			style={{
				width,
				height,
				borderRadius: radius
			}}
			aria-hidden='true'
		/>
	)
}
