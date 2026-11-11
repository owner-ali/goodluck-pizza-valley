import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { hasWebGL, prefersReducedMotion } from '../hooks/useCapabilities'
import { useInView } from '../hooks/useInView'
import Magnetic from '../components/Magnetic'
const HeroScene = lazy(() => import('../three/HeroScene'))

export default function Hero() {
  const [gl, setGl] = useState(false)
  const { ref, inView } = useInView<HTMLElement>('0px')
  const text = useRef<HTMLDivElement>(null)
  useEffect(() => setGl(hasWebGL()), [])
  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => gsap.from('.hero-line', { y: 40, opacity: 0, duration: 0.9, stagger: 0.14, ease: 'power3.out', delay: 1.1 }), text)
    return () => ctx.revert()
  }, [])
  return (
    <section id="top" ref={ref} className="relative isolate flex min-h-[100svh] items-end overflow-hidden pb-16 md:items-center md:pb-0"
      style={{ background: 'radial-gradient(70% 60% at 50% 40%, rgba(255,106,26,.28), transparent 70%), radial-gradient(40% 40% at 90% 10%, rgba(56,232,255,.2), transparent 70%), #0d0c0b' }}>
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        {gl ? <Suspense fallback={null}><HeroScene active={inView} /></Suspense> : <div className="grid h-full place-items-center text-8xl">🍕</div>}
      </div>
      <div ref={text} className="mx-auto w-full max-w-6xl px-6">
        <h1 className="hero-line max-w-xl text-5xl font-extrabold leading-[1.05] md:text-7xl">Taste the Happiness. <span className="text-frost">Feel the Chill.</span></h1>
        <p className="hero-line mt-4 max-w-md muted">Hot pizza from the Valley, cold mocktails from the Ice Bar.</p>
        <div className="hero-line mt-8 flex flex-wrap gap-3">
          <Magnetic><a href="#menu" className="btn btn-ember">Explore Menu</a></Magnetic>
          <Magnetic><a href="#menu" className="btn btn-frost">Order Now</a></Magnetic>
        </div>
      </div>
    </section>
  )
}
