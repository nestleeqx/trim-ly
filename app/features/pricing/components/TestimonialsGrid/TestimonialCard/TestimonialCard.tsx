import { Star, User } from 'lucide-react'
import { Testimonial } from '../../../pricing.config'
import styles from '../Testimonials.module.scss'

interface TestimonialCardProps {
	testimonial: Testimonial
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
	return (
		<div className={styles.testimonialCard}>
			<div className={styles.stars}>
				{[...Array(5)].map((_, i) => (
					<Star
						key={i}
						size={16}
						className={styles.star}
						fill='#f59e0b'
					/>
				))}
			</div>
			<p className={styles.testimonialQuote}>{testimonial.quote}</p>
			<div className={styles.testimonialAuthor}>
				<div className={styles.authorAvatar}>
					<User size={20} />
				</div>
				<div className={styles.authorInfo}>
					<span className={styles.authorName}>
						{testimonial.author}
					</span>
					<span className={styles.authorRole}>
						{testimonial.role}
					</span>
				</div>
			</div>
		</div>
	)
}
