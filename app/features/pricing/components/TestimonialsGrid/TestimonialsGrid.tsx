import { testimonials } from '../../pricing.config'
import TestimonialCard from './TestimonialCard/TestimonialCard'
import styles from './Testimonials.module.scss'

export default function TestimonialsGrid() {
	return (
		<div className={styles.testimonialsSection}>
			<div className={styles.testimonialsGrid}>
				{testimonials.map((testimonial, idx) => (
					<TestimonialCard
						key={idx}
						testimonial={testimonial}
					/>
				))}
			</div>
		</div>
	)
}
