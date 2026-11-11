import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../hooks/useCapabilities'
// Desktop only (mouse + hover). Native cursor stays visible for accessibility.
export default function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || prefersReducedMotion()) return
    const el = ref.current!
    el.style.display = 'block'
    const move = (e: PointerEvent) => {
      el.style.transform = `translate(${e.clientX - 16}px, ${e.clientY - 16}px)`
      el.dataset.hot = (e.target as Element).closest('a,button,input,select,[role=button]') ? '1' : '0'
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [])
  return <div ref={ref} aria-hidden="true" className="cursor-ring" />
}
