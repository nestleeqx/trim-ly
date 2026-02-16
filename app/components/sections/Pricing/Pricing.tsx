'use client'

import Modal from '@/app/components/ui/Modal/Modal'
import Toast from '@/app/components/ui/Toast/Toast'
import ContactForm from '@/app/features/pricing/components/ContactForm/ContactForm'
import PricingPlansGrid from './components/PricingPlansGrid'
import PricingSectionHeader from './components/PricingSectionHeader'
import usePricingSection from './hooks/usePricingSection'
import styles from './Pricing.module.scss'

export default function Pricing() {
	const vm = usePricingSection()

	return (
		<>
			<section
				className={styles.pricing}
				id='pricing'
			>
				<div className='container'>
					<PricingSectionHeader
						isYearly={vm.isYearly}
						onToggle={vm.setIsYearly}
					/>

					<PricingPlansGrid
						plansData={vm.resolvedPlans}
						isYearly={vm.isYearly}
						isAuthenticated={vm.isAuthenticated}
						currentPlanId={vm.currentPlanId}
						isUpdatingPlan={vm.isUpdatingPlan}
						onContactClick={vm.openContactModal}
						onSelectPlan={vm.handleSelectPlan}
					/>
				</div>

				<Modal
					isOpen={vm.isContactModalOpen}
					onClose={vm.closeContactModal}
					title='Связаться с отделом продаж'
				>
					<ContactForm />
				</Modal>
			</section>

			<Toast
				message={vm.toast.message}
				isVisible={vm.toast.isVisible}
				onClose={vm.hideToast}
				variant={vm.toast.variant}
			/>
		</>
	)
}

