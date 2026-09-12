import { Orientation, getFrameSize } from '../lib/deviceSpecs'
import styles from './ViewportControls.module.css'

interface ViewportControlsProps {
  foldProgress: number
  onFoldChange: (value: number) => void
  orientation: Orientation
  onOrientationChange: (value: Orientation) => void
  isSweeping: boolean
  onSweep: () => void
  onCancelSweep: () => void
}

export default function ViewportControls({
  foldProgress,
  onFoldChange,
  orientation,
  onOrientationChange,
  isSweeping,
  onSweep,
  onCancelSweep,
}: ViewportControlsProps) {
  const { width, height } = getFrameSize(foldProgress, orientation)

  return (
    <div className={styles.wrap}>
      <div className={styles.row}>
        <div className={styles.snapGroup} role="group" aria-label="Jump to state">
          <button
            type="button"
            className={styles.snapButton}
            data-active={foldProgress === 0}
            onClick={() => onFoldChange(0)}
            disabled={isSweeping}
          >
            Outer
          </button>
          <button
            type="button"
            className={styles.snapButton}
            data-active={foldProgress === 1}
            onClick={() => onFoldChange(1)}
            disabled={isSweeping}
          >
            Inner
          </button>
        </div>

        <button
          type="button"
          className={styles.sweepButton}
          onClick={isSweeping ? onCancelSweep : onSweep}
        >
          {isSweeping ? 'Stop' : 'Auto-sweep'}
        </button>

        <div className={styles.orientationGroup} role="group" aria-label="Orientation">
          <button
            type="button"
            className={styles.orientationButton}
            data-active={orientation === 'portrait'}
            onClick={() => onOrientationChange('portrait')}
          >
            Portrait
          </button>
          <button
            type="button"
            className={styles.orientationButton}
            data-active={orientation === 'landscape'}
            onClick={() => onOrientationChange('landscape')}
          >
            Landscape
          </button>
        </div>
      </div>

      <div className={styles.sliderRow}>
        <input
          className={styles.slider}
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={foldProgress}
          disabled={isSweeping}
          onChange={(e) => onFoldChange(Number(e.target.value))}
          aria-label="Fold progress, closed to open"
        />
        <span className={styles.readout}>
          {Math.round(width)} × {Math.round(height)} pt
        </span>
      </div>
    </div>
  )
}
