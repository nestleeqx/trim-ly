export interface SearchConfig {
	value: string
	onChange: (value: string) => void
	onSearch: (value: string) => void
	placeholder?: string
	autoSubmit?: boolean
	debounceMs?: number
}
