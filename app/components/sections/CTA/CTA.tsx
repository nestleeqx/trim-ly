'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import Button from '../../ui/Button'
import DemoModal from '../../ui/DemoModal'
import styles from './CTA.module.scss'

export default function CTA() {
	const [isDemoModalOpen, setIsDemoModalOpen] = useState(false)

	return (
		<section className={styles.cta}>
			<div className='container'>
				<motion.div
					className={styles.card}
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.3 }}
					transition={{ duration: 0.6 }}
				>
					<h2 className={styles.title}>
						Начните сокращать ссылки сегодня
					</h2>
					<p className={styles.subtitle}>
						Создайте свою первую короткую ссылку менее чем за
						минуту. Присоединяйтесь к 10 000+ создателей и небольшим
						командам.
					</p>
					<div className={styles.actions}>
						<Link
							href='/signup'
							className={styles.actionLink}
						>
							<Button
								variant='invertPrimary'
								size='lg'
								className={styles.primaryBtn}
							>
								Создать бесплатный аккаунт
								<ArrowRight size={18} />
							</Button>
						</Link>
						<Button
							variant='invertOutline'
							size='lg'
							className={styles.secondaryBtn}
							onClick={() => setIsDemoModalOpen(true)}
						>
							Посмотреть демо
						</Button>
					</div>
					<p className={styles.note}>
						Банковская карта не требуется. Отмена в любое время.
					</p>
				</motion.div>
			</div>
			<DemoModal
				isOpen={isDemoModalOpen}
				onClose={() => setIsDemoModalOpen(false)}
			/>
		</section>
	)
}
