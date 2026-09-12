import { useState } from 'react'
import UrlBar from './components/UrlBar'
import ViewportControls from './components/ViewportControls'
import DeviceCanvas from './components/DeviceCanvas'
import IssuePanel from './components/IssuePanel'
import { Orientation } from './lib/deviceSpecs'
import { useAutoSweep } from './lib/useAutoSweep'
import styles from './App.module.css'

export default function App() {
  const [url, setUrl] = useState('')
  const [foldProgress, setFoldProgress] = useState(0)
  const [orientation, setOrientation] = useState<Orientation>('portrait')

  const { isSweeping, run, cancel } = useAutoSweep(setFoldProgress)

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Fold Check</h1>
          <p className={styles.subtitle}>Responsiveness testing for <b>iPhone Duo</b>'s outer and inner displays</p>
        </div>
        <UrlBar onSubmit={setUrl} />
      </header>

      <main className={styles.main}>
        <div className={styles.canvasColumn}>
          <ViewportControls
            foldProgress={foldProgress}
            onFoldChange={setFoldProgress}
            orientation={orientation}
            onOrientationChange={setOrientation}
            isSweeping={isSweeping}
            onSweep={run}
            onCancelSweep={cancel}
          />
          <DeviceCanvas url={url} foldProgress={foldProgress} orientation={orientation} />
        </div>

        <IssuePanel />
      </main>
    </div>
  )
}
