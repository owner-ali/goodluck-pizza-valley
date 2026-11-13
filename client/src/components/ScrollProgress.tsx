import { useEffect, useRef } from 'react'
export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const on = () => { const h = document.documentElement; if (ref.current) ref.current.style.transform = `scaleX(${h.scrollTop / ((h.scrollHeight - h.clientHeight) || 1)})` }
    window.addEventListener('scroll', on, { passive: true }); return () => window.removeEventListener('scroll', on)
  }, [])
  return <div ref={ref} className="progress" aria-hidden="true" />
}
