'use client'

import Modal from '@/app/components/ui/Modal/Modal'
import ContactForm from '@/app/features/pricing/components/ContactForm/ContactForm'
import { useCallback, useState } from 'react'
import styles from './Footer.module.scss'
import FooterBottom from './FooterBottom'
import FooterBrand from './FooterBrand'
import FooterLinks from './FooterLinks'

export default function Footer() {
	const [isContactModalOpen, setContactModalOpen] = useState(false)

	const openContactModal = useCallback(() => setContactModalOpen(true), [])
	const closeContactModal = useCallback(() => setContactModalOpen(false), [])

	return (
		<footer className={styles.footer}>
			<div className='container'>
				<div className={styles.content}>
					<FooterBrand />
					<FooterLinks onContactClick={openContactModal} />
				</div>
				<FooterBottom />
			</div>

			<Modal
				isOpen={isContactModalOpen}
				onClose={closeContactModal}
				title='Связаться с нами'
			>
				<ContactForm />
			</Modal>
		</footer>
	)
}
