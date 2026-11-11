export function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch { return false }
}
export const isMobile = () => window.matchMedia('(max-width: 767px)').matches
export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
