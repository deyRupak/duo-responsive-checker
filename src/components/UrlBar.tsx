import { FormEvent, useEffect, useRef, useState } from 'react'
import styles from './UrlBar.module.css'

interface UrlBarProps {
  onSubmit: (url: string) => void
}

const STORAGE_KEY = 'fold-check:recent-urls'
const MAX_RECENT = 5

function normalize(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return ''
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

// normalize() only adds a scheme — it never checked whether what's left
// is actually a plausible host. This does: valid via the URL parser,
// AND the hostname looks like a real domain (has a dot + a TLD-ish
// label), localhost (with or without a port), or a bare IPv4 address.
function isLikelyUrl(candidate: string): boolean {
  let parsed: URL
  try {
    parsed = new URL(candidate)
  } catch {
    return false
  }

  const host = parsed.hostname
  if (host === 'localhost') return true
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return true
  return /^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i.test(host)
}

function loadRecent(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === 'string') : []
  } catch {
    // Private browsing, storage disabled, or corrupted data — degrade
    // silently, this is a convenience feature, not a critical one.
    return []
  }
}

function saveRecent(list: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {
    // Ignore write failures for the same reason as above.
  }
}

export default function UrlBar({ onSubmit }: UrlBarProps) {
  const [value, setValue] = useState('')
  const [recent, setRecent] = useState<string[]>([])
  const [isFocused, setIsFocused] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const showDropdown = isFocused && recent.length > 0

  useEffect(() => {
    setRecent(loadRecent())
  }, [])

  function remember(url: string) {
    setRecent((prev) => {
      const next = [url, ...prev.filter((u) => u !== url)].slice(0, MAX_RECENT)
      saveRecent(next)
      return next
    })
  }

  function submit(url: string) {
    const normalized = normalize(url)
    if (!normalized) return
    if (!isLikelyUrl(normalized)) {
      setError('That doesn\'t look like a valid URL — try something like yoursite.com or localhost:3000')
      return
    }
    setError(null)
    remember(normalized)
    onSubmit(normalized)
    setValue(normalized)
    inputRef.current?.blur()
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    submit(value)
  }

  return (
    <div className={styles.wrap}>
      <form className={styles.bar} onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          className={styles.input}
          type="text"
          inputMode="url"
          placeholder="yoursite.com"
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            if (error) setError(null)
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-label="Site URL to test"
        />
        <button className={styles.button} type="submit">
          Test
        </button>
      </form>

      {error && <p className={styles.error}>{error}</p>}

      {showDropdown && (
        <ul className={styles.dropdown} role="listbox" aria-label="Recently tested URLs">
          {recent.map((url) => (
            <li key={url}>
              {/* onMouseDown fires before the input's onBlur, so the click
                  registers before the dropdown closes. */}
              <button
                type="button"
                className={styles.dropdownItem}
                onMouseDown={(e) => {
                  e.preventDefault()
                  submit(url)
                }}
              >
                {url}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}