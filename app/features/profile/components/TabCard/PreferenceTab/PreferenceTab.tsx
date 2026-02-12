import TabCard from '../TabCard'
import PreferenceActionsSection from './components/PreferenceActionsSection/PreferenceActionsSection'
import PreferenceNoticesSection from './components/PreferenceNoticesSection/PreferenceNoticesSection'
import PreferenceTabSkeleton from './components/PreferenceTabSkeleton/PreferenceTabSkeleton'
import ThemeCardsSection from './components/ThemeCardsSection/ThemeCardsSection'
import usePreferenceTab from './hooks/usePreferenceTab'

export default function PreferenceTab() {
	const vm = usePreferenceTab()

	return (
		<TabCard
			title='Оформление'
			subtitle='Выберите тему приложения'
		>
			{vm.isLoading ? (
				<PreferenceTabSkeleton />
			) : (
				<>
					<ThemeCardsSection
						theme={vm.theme}
						isSaving={vm.isSaving}
						onSelectTheme={vm.handleSelectTheme}
					/>

					<PreferenceNoticesSection
						error={vm.error}
						success={vm.success}
					/>

					<PreferenceActionsSection
						isVisible={vm.hasChanges}
						isSaving={vm.isSaving}
						onSave={vm.save}
					/>
				</>
			)}
		</TabCard>
	)
}
