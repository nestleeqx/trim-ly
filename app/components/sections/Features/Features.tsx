'use client';

import React from 'react';
import { Link2, BarChart3, QrCode, User } from 'lucide-react';
import styles from './Features.module.scss';

const Features: React.FC = () => {
	const features = [
		{
			icon: Link2,
			title: 'Брендированные ссылки',
			description:
				'Кастомные алиасы, чистые URL и опциональные брендированные домены для доверия аудитории.',
			href: '#links',
			color: '#60a5fa',
		},
		{
			icon: BarChart3,
			title: 'Аналитика в реальном времени',
			description:
				'Глубокая аналитика кликов, источников, стран и устройств для оптимизации эффективности.',
			href: '#analytics',
			color: '#818cf8',
		},
		{
			icon: QrCode,
			title: 'QR-коды',
			description:
				'Генерируйте настраиваемые QR-коды для любой ссылки. Скачивайте в форматах SVG/PNG.',
			href: '#qr',
			color: '#a78bfa',
		},
		{
			icon: User,
			title: 'Страница link-in-bio',
			description:
				'Красивая мобильная страница для всех ваших ссылок. Полностью настраиваемая тема.',
			href: '#bio',
			color: '#c084fc',
		},
	];

	return (
		<section className={styles.features} id="features">
			<div className="container">
				<div className={styles.header}>
					<h2 className={styles.title}>Всё для управления ссылками</h2>
					<p className={styles.subtitle}>
						Наша платформа сочетает простое сокращение с мощными инструментами роста.
					</p>
				</div>

				<div className={styles.grid}>
					{features.map((feature) => {
						const IconComponent = feature.icon;
						return (
							<a
								key={feature.title}
								href={feature.href}
								className={styles.card}
							>
								<div
									className={styles.iconWrapper}
									style={{ '--icon-color': feature.color } as React.CSSProperties}
								>
									<IconComponent size={24} />
								</div>
								<h3 className={styles.cardTitle}>{feature.title}</h3>
								<p className={styles.cardDescription}>{feature.description}</p>
								<span className={styles.learnMore}>Подробнее →</span>
							</a>
						);
					})}
				</div>
			</div>
		</section>
	);
};

export default Features;
