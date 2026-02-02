'use client'

import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import styles from './FAQ.module.scss'

interface FAQItem {
	question: string
	answer: string
}

const faqs: FAQItem[] = [
	{
		question: 'Предоставляете ли вы кастомные домены?',
		answer: 'Да! Тарифы Pro и Команда позволяют подключить собственные домены и создавать полностью брендированные ссылки вида links.вашбренд.com. Это повышает узнаваемость бренда и доверие пользователей.'
	},
	{
		question: 'Безопасна ли аналитика для конфиденциальности?',
		answer: 'Абсолютно. Мы полностью соблюдаем GDPR и другие нормы защиты данных. Вся собираемая статистика анонимизирована, мы не передаем данные третьим лицам и не используем их для рекламы.'
	},
	{
		question: 'Могу ли я генерировать QR-коды?',
		answer: 'Да, все тарифы включают генерацию статических QR-кодов. На тарифе Pro доступны динамические QR-коды с возможностью редактирования ссылки без изменения самого кода — идеально для печатных материалов.'
	},
	{
		question: 'Могу ли я редактировать ссылку после создания?',
		answer: 'Да, вы можете изменить destination URL в любой момент. Короткая ссылка останется прежней, но будет вести на новый адрес. Это особенно полезно для исправления ошибок или обновления устаревших материалов.'
	},
	{
		question: 'Есть ли API для интеграций?',
		answer: 'Да, полноценный API доступен на тарифе Команда. С его помощью вы можете автоматизировать создание ссылок, получать аналитику в реальном времени и интегрировать наш сервис с вашими CRM, маркетинговыми платформами и внутренними системами.'
	}
]

export default function FAQ() {
	const [openIndex, setOpenIndex] = useState<number | null>(0)

	const toggle = (index: number) => {
		setOpenIndex(openIndex === index ? null : index)
	}

	return (
		<section
			className={styles.faq}
			id='faq'
		>
			<div className='container'>
				<motion.div
					className={styles.header}
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.5 }}
					transition={{ duration: 0.5 }}
				>
					<h2 className={styles.title}>Часто задаваемые вопросы</h2>
					<p className={styles.subtitle}>
						Всё, что нужно знать о продукте.
					</p>
				</motion.div>

				<div
					className={styles.accordion}
					role='region'
					aria-label='Часто задаваемые вопросы'
				>
					{faqs.map((faq, index) => {
						const isOpen = openIndex === index
						return (
							<motion.div
								key={index}
								className={`${styles.item} ${isOpen ? styles.open : ''}`}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, amount: 0.3 }}
								transition={{ duration: 0.4, delay: index * 0.05 }}
							>
								<button
									type='button'
									className={styles.question}
									onClick={() => toggle(index)}
									aria-expanded={isOpen}
									aria-controls={`faq-answer-${index}`}
								>
									<span className={styles.questionText}>
										{faq.question}
									</span>
									<ChevronDown
										className={styles.icon}
										size={20}
										aria-hidden='true'
									/>
								</button>
								<div
									id={`faq-answer-${index}`}
									className={styles.answer}
									aria-hidden={!isOpen}
								>
									<div className={styles.answerInner}>
										<div className={styles.answerContent}>
											{faq.answer}
										</div>
									</div>
								</div>
							</motion.div>
						)
					})}
				</div>
			</div>
		</section>
	)
}
