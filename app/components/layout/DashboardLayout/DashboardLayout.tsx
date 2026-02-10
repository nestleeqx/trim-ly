'use client'

import Sidebar from '@/app/components/layout/DashboardLayout/Sidebar/Sidebar'
import React from 'react'
import styles from './DashboardLayout.module.scss'

interface DashboardLayoutProps {
	children: React.ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
	return (
		<div className={styles.layout}>
			<Sidebar />
			<main className={styles.main}>{children}</main>
		</div>
	)
}

export default DashboardLayout
