import Button from '@/app/components/ui/Button/Button'
import { useState } from 'react'
import styles from './ProductPreview.module.scss'

interface UrlInputProps {
	onShorten: () => void
}

export default function UrlInput({ onShorten }: UrlInputProps) {
	const [value, setValue] = useState('')

	const handleShorten = () => {
		if (value.trim()) {
			onShorten()
			setValue('')
		}
	}

	return (
		<div className={styles.urlInput}>
			<input
				type='text'
				placeholder='Вставьте длинную ссылку...'
				value={value}
				onChange={e => setValue(e.target.value)}
			/>
			<Button
				variant='primary'
				size='sm'
				onClick={handleShorten}
			>
				Сократить
			</Button>
		</div>
	)
}
