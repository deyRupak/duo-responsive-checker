/**
 * iPhone Duo viewport figures.
 *
 * These point values are NOT an official Apple spec. Apple has published
 * pixel resolutions and densities, but not CSS/point dimensions. The
 * numbers below are inferred from App Store Connect's screenshot
 * specifications (2034x1398 outer, 2853x2007 inner) at an assumed 3x
 * scale factor. Update these once Xcode's Device Hub (shipping with
 * Xcode 27.1) or WebKit release notes confirm real numbers.
 */
export const OUTER = {
  width: 466,
  height: 678,
} as const

export const INNER_PORTRAIT = {
  width: 669,
  height: 951,
} as const

export const INNER_LANDSCAPE = {
  width: INNER_PORTRAIT.height,
  height: INNER_PORTRAIT.width,
} as const

export type Orientation = 'portrait' | 'landscape'

/**
 * Given a fold progress (0 = fully closed/outer, 1 = fully open/inner)
 * and an orientation, return the frame's current content dimensions.
 *
 * Orientation is treated as an independent control layered on top of
 * the fold progress: it rotates whatever the current fold width/height
 * pair is, rather than being tied to a specific fold state. This is a
 * simplification — a real closed Duo is only really used in portrait —
 * but it keeps the control model simple and predictable to operate.
 */
export function getFrameSize(foldProgress: number, orientation: Orientation) {
  const clamped = Math.max(0, Math.min(1, foldProgress))
  const width = OUTER.width + (INNER_PORTRAIT.width - OUTER.width) * clamped
  const height = OUTER.height + (INNER_PORTRAIT.height - OUTER.height) * clamped

  if (orientation === 'landscape') {
    return { width: height, height: width }
  }
  return { width, height }
}

/** Anything above 0 fold progress counts as "open" for bezel-chrome purposes. */
export function isOpenState(foldProgress: number) {
  return foldProgress > 0
}
