import { useCallback, useRef, useState } from 'react'

const PAUSE_MS = 700
const SWEEP_MS = 1100

/**
 * Animates fold progress from 0 -> 1, pausing briefly at each end so
 * the closed and open states are actually legible, not just flashed
 * past mid-motion.
 */
export function useAutoSweep(setFoldProgress: (value: number) => void) {
  const [isSweeping, setIsSweeping] = useState(false)
  const cancelRef = useRef(false)

  const sleep = (ms: number) =>
    new Promise<void>((resolve) => {
      setTimeout(resolve, ms)
    })

  const animateTo = (target: number, duration: number) =>
    new Promise<void>((resolve) => {
      const start = performance.now()
      const from = target === 1 ? 0 : 1

      function tick(now: number) {
        if (cancelRef.current) {
          resolve()
          return
        }
        const elapsed = now - start
        const t = Math.min(1, elapsed / duration)
        // ease-in-out
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
        setFoldProgress(from + (target - from) * eased)
        if (t < 1) {
          requestAnimationFrame(tick)
        } else {
          resolve()
        }
      }
      requestAnimationFrame(tick)
    })

  const run = useCallback(async () => {
    cancelRef.current = false
    setIsSweeping(true)
    setFoldProgress(0)
    await sleep(PAUSE_MS)
    if (cancelRef.current) return setIsSweeping(false)
    await animateTo(1, SWEEP_MS)
    if (cancelRef.current) return setIsSweeping(false)
    await sleep(PAUSE_MS)
    setIsSweeping(false)
  }, [setFoldProgress])

  const cancel = useCallback(() => {
    cancelRef.current = true
    setIsSweeping(false)
  }, [])

  return { isSweeping, run, cancel }
}
