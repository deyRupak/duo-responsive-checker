import { useEffect, useMemo, useRef, useState } from 'react'
import { Orientation, getFrameSize, isOpenState } from '../lib/deviceSpecs'
import styles from './DeviceCanvas.module.css'

interface DeviceCanvasProps {
  url: string
  foldProgress: number
  orientation: Orientation
}

const BEZEL = 14

export default function DeviceCanvas({ url, foldProgress, orientation }: DeviceCanvasProps) {
  const { width, height } = getFrameSize(foldProgress, orientation)
  const isOpen = isOpenState(foldProgress)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const [spinAnim, setSpinAnim] = useState<'' | 'spinCw' | 'spinCcw'>('')
  const prevOrientation = useRef(orientation)
  const wasOpen = useRef(isOpen)

  useEffect(() => {
    if (orientation !== prevOrientation.current && !wasOpen.current) {
      const dir = orientation === 'landscape' ? 'spinCw' : 'spinCcw'
      setSpinAnim('')
      requestAnimationFrame(() => setSpinAnim(dir))
    }
    prevOrientation.current = orientation
    wasOpen.current = isOpen
  }, [orientation, isOpen])

  const outerRadius = orientation === 'landscape'
    ? '28px 28px 4px 4px'
    : '4px 28px 28px 4px'
  const innerRadius = '22px'

  const outerContentRadius = orientation === 'landscape'
    ? '16px 16px 2px 2px'
    : '2px 16px 16px 2px'
  const innerContentRadius = '14px'
  const contentRadius = isOpen ? innerContentRadius : outerContentRadius

  const hingeAxis: 'vertical' | 'horizontal' = orientation === 'landscape' ? 'vertical' : 'horizontal'

  const frameStyle = useMemo(
    () => ({
      width: `${width}px`,
      height: `${height}px`,
    }),
    [width, height],
  )

  return (
    <div className={styles.stage}>
      <div
        className={`${styles.frame} ${spinAnim ? styles[spinAnim] : ''}`}
        style={frameStyle}
      >
        <div
          className={styles.chrome}
          data-visible={!isOpen}
          style={{ borderRadius: outerRadius }}
        >
          <div className={styles.hingeEdge} />
          <div className={styles.cameraOuter} />
        </div>

        <div
          className={styles.chrome}
          data-visible={isOpen}
          style={{ borderRadius: innerRadius }}
        >
          <div
            className={
              hingeAxis === 'vertical' ? styles.hingeCenterVertical : styles.hingeCenterHorizontal
            }
          />
          <div
            className={
              orientation === 'landscape' ? styles.cameraInnerLandscape : styles.cameraInnerPortrait
            }
          />
        </div>

        <div
          className={styles.content}
          style={{
            top: BEZEL,
            left: BEZEL,
            right: BEZEL,
            bottom: BEZEL,
            borderRadius: contentRadius,
          }}
        >
          {url ? (
            <iframe
              ref={iframeRef}
              key={url}
              src={url}
              title="Site under test"
              className={styles.iframe}
            />
          ) : (
            <div className={styles.placeholder}>Enter a URL above to start testing</div>
          )}
        </div>
      </div>
    </div>
  )
}