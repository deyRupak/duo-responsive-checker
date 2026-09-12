import styles from './IssuePanel.module.css'

export default function IssuePanel() {
  return (
    <aside className={styles.panel}>
      <h2 className={styles.heading}>Checks</h2>
      <p className={styles.note}>
        Live layout checks (overflow, tap-target size, clipped text) need to read inside the
        tested page, which cross-origin sites block by default in an iframe. This first pass
        covers frame sizing and the fold transition; automated checks are the next layer to add;
        for now, use the resize/auto-sweep and your own eyes to catch breakage.
      </p>

      <hr />
      
      <p className={styles.note}>
          Viewport point values are inferred from App Store Connect's screenshot specs, not an
          official Apple spec. Treat them as best-available until Xcode's Device Hub confirms them.
      </p>
      
      <hr />
      
      <p className={styles.note}>
        Some sites may block embedding (common security header), so it might not render inside
        the frame. Layout still resizes correctly; try a different/locally-served page for full preview.
      </p>
    </aside>
  )
}
