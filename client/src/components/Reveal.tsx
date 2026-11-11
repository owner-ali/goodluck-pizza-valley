import { useEffect, useRef, useState, type ReactNode } from 'react'
import { prefersReducedMotion } from '../hooks/useCapabilities'
export default function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(() => prefersReducedMotion())
  useEffect(() => {
    if (shown || !ref.current) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect() } }, { threshold: 0.15 })
    io.observe(ref.current); return () => io.disconnect()
  }, [shown])
  return <div ref={ref} className={`${className} transition-all duration-700 ${shown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>{children}</div>
}
