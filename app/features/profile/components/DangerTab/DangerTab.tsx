import NoticeBanner from '@/app/components/ui/NoticeBanner/NoticeBanner'
import { AlertTriangle } from 'lucide-react'
import DeleteAccountModal from './components/DeleteAccountModal/DeleteAccountModal'
import DeleteAccountSection from './components/DeleteAccountSection/DeleteAccountSection'
import TransferWorkspaceSection from './components/TransferWorkspaceSection/TransferWorkspaceSection'
import styles from './DangerTab.module.scss'
import useDangerTab from './hooks/useDangerTab'

export default function DangerTab() {
	const vm = useDangerTab()

	return (
		<>
			<div className={styles.card}>
				<div className={styles.headerRow}>
					<div className={styles.headerLeft}>
						<div className={styles.iconWrap}>
							<AlertTriangle size={18} />
						</div>
						<div>
							<h3 className={styles.title}>Опасная зона</h3>
							<p className={styles.subtitle}>
								Эти действия постоянны и не могут быть отменены.
								Пожалуйста, действуйте осторожно.
							</p>
						</div>
					</div>
				</div>

				<DeleteAccountSection onDeleteClick={vm.openDeleteModal} />
				<TransferWorkspaceSection
					onTransferClick={vm.showTransferDemo}
				/>
			</div>
			<NoticeBanner
				key={vm.noticeKey}
				className={styles.noticeDemo}
				message={vm.demoMessage}
				type='info'
			/>
			<DeleteAccountModal
				isOpen={vm.isDeleteModalOpen}
				password={vm.password}
				confirmationText={vm.confirmationText}
				requiresPassword={vm.requiresPassword}
				isDeleteAuthModeLoading={vm.isDeleteAuthModeLoading}
				error={vm.deleteError}
				isDeleting={vm.isDeleting}
				onPasswordChange={vm.setPassword}
				onConfirmationTextChange={vm.setConfirmationText}
				onClose={vm.closeDeleteModal}
				onConfirm={vm.handleDeleteAccount}
			/>
		</>
	)
}
