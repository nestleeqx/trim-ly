'use client'

import BillingToggle from '@/app/components/ui/BillingToggle/BillingToggle'
import ContactForm from '@/app/components/ui/ContactForm'
import DashboardHeader from '@/app/components/ui/DashboardHeader'

import FAQList from '@/app/components/ui/FAQ/FAQList'
import Modal from '@/app/components/ui/Modal'
import PlanCard from '@/app/components/ui/PlanCard/PlanCard'
import { Check, Star, User } from 'lucide-react'
import { useCallback, useState } from 'react'
import styles from './page.module.scss'
import {
	ComparisonFeature,
	comparisonFeatures,
	dashboardPlans,
	faqItems,
	Testimonial,
	testimonials
} from './pricing.config'

interface ComparisonCellProps {
	value: string | boolean
	isHighlight?: boolean
}

const ComparisonCell: React.FC<ComparisonCellProps> = ({
	value,
	isHighlight
}) => {
	if (typeof value === 'boolean') {
		return (
			<div className={`${styles.tableCell} ${styles.center}`}>
				{value ? (
					<Check
						size={18}
						className={styles.checkMark}
					/>
				) : (
					<span className={styles.dash}>—</span>
				)}
			</div>
		)
	}

	return (
		<div
			className={`${styles.tableCell} ${styles.center} ${isHighlight ? styles.highlight : ''}`}
		>
			{value}
		</div>
	)
}

interface ComparisonRowProps {
	feature: ComparisonFeature
}

const ComparisonRow: React.FC<ComparisonRowProps> = ({ feature }) => {
	return (
		<div className={styles.tableRow}>
			<div className={`${styles.tableCell} ${styles.featureName}`}>
				{feature.name}
			</div>
			<ComparisonCell value={feature.free} />
			<ComparisonCell
				value={feature.pro}
				isHighlight
			/>
			<ComparisonCell value={feature.team} />
		</div>
	)
}

// Testimonial Card
interface TestimonialCardProps {
	testimonial: Testimonial
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
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

export default function PricingPage() {
	const [isYearly, setIsYearly] = useState(false)
	const [isContactModalOpen, setContactModalOpen] = useState(false)
	const openContactModal = useCallback(() => setContactModalOpen(true), [])
	const closeContactModal = useCallback(() => setContactModalOpen(false), [])

	return (
		<>
			<DashboardHeader
				title='Pricing'
				subtitle='Обзор вашего аккаунта.'
				showCreateButton={true}
			/>

			<div className={styles.content}>
				<div className={styles.header}>
					<h2 className={styles.title}>
						Простые тарифы для каждого этапа
					</h2>
					<p className={styles.subtitle}>
						Начните бесплатно. Масштабируйтесь по мере роста.
						Управляйте ссылками с помощью профессиональных
						инструментов и аналитики.
					</p>

					<BillingToggle
						isYearly={isYearly}
						onToggle={setIsYearly}
					/>
				</div>

				<div className={styles.grid}>
					{dashboardPlans.map(plan => (
						<PlanCard
							key={plan.name}
							plan={plan}
							isYearly={isYearly}
							onContactClick={openContactModal}
						/>
					))}
				</div>

				{/* Comparison Table */}
				<div className={styles.comparisonSection}>
					<div className={styles.comparisonHeader}>
						<h3 className={styles.comparisonTitle}>
							Сравнение возможностей
						</h3>
						<p className={styles.comparisonSubtitle}>
							Найдите подходящий план для вашего рабочего
							процесса.
						</p>
					</div>

					<div className={styles.comparisonTable}>
						<div className={styles.tableHeader}>
							<div className={styles.tableHeaderCell}>
								Функция
							</div>
							<div
								className={`${styles.tableHeaderCell} ${styles.center}`}
							>
								Free
							</div>
							<div
								className={`${styles.tableHeaderCell} ${styles.center} ${styles.highlight}`}
							>
								Pro
							</div>
							<div
								className={`${styles.tableHeaderCell} ${styles.center}`}
							>
								Team
							</div>
						</div>

						{comparisonFeatures.map((feature, idx) => (
							<ComparisonRow
								key={idx}
								feature={feature}
							/>
						))}
					</div>
				</div>

				{/* Testimonials */}
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

				{/* FAQ */}
				<div className={styles.faqSection}>
					<div className={styles.faqHeader}>
						<h3 className={styles.faqTitle}>
							Часто задаваемые вопросы
						</h3>
					</div>

					<div className={styles.faqAccordion}>
						<FAQList
							items={faqItems}
							initialOpenIndex={null}
						/>
					</div>
				</div>
			</div>

			<Modal
				isOpen={isContactModalOpen}
				onClose={closeContactModal}
				title='Связаться с отделом продаж'
			>
				<ContactForm />
			</Modal>
		</>
	)
}
