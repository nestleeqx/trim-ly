'use client'

import { motion, Variants } from 'framer-motion'
import { ReactNode } from 'react'

interface MotionWrapperProps {
	children: ReactNode
	className?: string
	delay?: number
	duration?: number
	once?: boolean
	amount?: number
	variant?: 'fadeUp' | 'fadeIn' | 'fadeLeft' | 'fadeRight' | 'scale' | 'stagger'
}

const variants: Record<string, Variants> = {
	fadeUp: {
		hidden: { opacity: 0, y: 30 },
		visible: { opacity: 1, y: 0 }
	},
	fadeIn: {
		hidden: { opacity: 0 },
		visible: { opacity: 1 }
	},
	fadeLeft: {
		hidden: { opacity: 0, x: -30 },
		visible: { opacity: 1, x: 0 }
	},
	fadeRight: {
		hidden: { opacity: 0, x: 30 },
		visible: { opacity: 1, x: 0 }
	},
	scale: {
		hidden: { opacity: 0, scale: 0.9 },
		visible: { opacity: 1, scale: 1 }
	},
	stagger: {
		hidden: { opacity: 0 },
		visible: { opacity: 1 }
	}
}

const MotionWrapper: React.FC<MotionWrapperProps> = ({
	children,
	className,
	delay = 0,
	duration = 0.5,
	once = true,
	amount = 0.2,
	variant = 'fadeUp'
}) => {
	return (
		<motion.div
			className={className}
			initial="hidden"
			whileInView="visible"
			viewport={{ once, amount }}
			variants={variants[variant]}
			transition={{
				duration,
				delay
			}}
		>
			{children}
		</motion.div>
	)
}

export default MotionWrapper
