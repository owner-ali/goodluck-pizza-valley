import { useRef, type ReactNode, type PointerEvent as RPE } from 'react'
import { prefersReducedMotion } from '../hooks/useCapabilities'
export default function Magnetic({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null)
  const move = (e: RPE<HTMLElement>) => {
    if (e.pointerType !== 'mouse' || prefersReducedMotion()) return
    const r = ref.current!.getBoundingClientRect()
    ref.current!.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.2}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`
  }
  return <span ref={ref} className="inline-block transition-transform duration-150" onPointerMove={move} onPointerLeave={() => { if (ref.current) ref.current.style.transform = '' }}>{children}</span>
}
