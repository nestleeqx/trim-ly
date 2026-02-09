import styles from './page.module.scss'
import { testimonials } from './pricing.config'
import { TestimonialCard } from './TestimonialCard'

export const TestimonialsGrid: React.FC = () => {
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
