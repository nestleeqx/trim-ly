import TabCard from '../TabCard/TabCard'
import AvatarSection from './components/AvatarSection/AvatarSection'
import ProfileActionsSection from './components/ProfileActionsSection/ProfileActionsSection'
import ProfileFormSection from './components/ProfileFormSection/ProfileFormSection'
import ProfileNoticesSection from './components/ProfileNoticesSection/ProfileNoticesSection'
import ProfileTabSkeleton from './components/ProfileTabSkeleton/ProfileTabSkeleton'
import useProfileTab from './hooks/useProfileTab'

export default function ProfileTab() {
	const vm = useProfileTab()

	return (
		<TabCard
			title='Информация профиля'
			subtitle='Обновите личные данные и то, как вас видят другие.'
		>
			{vm.isLoading ? (
				<ProfileTabSkeleton />
			) : (
				<>
					<AvatarSection {...vm.avatar} />
					<ProfileFormSection {...vm.form} />
					<ProfileNoticesSection
						error={vm.error}
						success={vm.success}
					/>
					<ProfileActionsSection
						isSaving={vm.actions.isSaving}
						hasProfileChanges={vm.actions.hasProfileChanges}
						isError={vm.actions.isError}
						onSave={vm.actions.onSave}
					/>
				</>
			)}
		</TabCard>
	)
}
