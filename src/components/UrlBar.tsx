import { FormEvent, useState } from 'react'
import styles from './UrlBar.module.css'

interface UrlBarProps {
  onSubmit: (url: string) => void
}

function normalize(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return ''
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

export default function UrlBar({ onSubmit }: UrlBarProps) {
  const [value, setValue] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const normalized = normalize(value)
    if (normalized) onSubmit(normalized)
  }

  return (
    <form className={styles.bar} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        type="text"
        inputMode="url"
        placeholder="yoursite.com"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="Site URL to test"
      />
      <button className={styles.button} type="submit">
        Test
      </button>
    </form>
  )
}
