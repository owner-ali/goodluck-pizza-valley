import { lazy, Suspense, useEffect, useRef, useState, type PointerEvent as RPE } from 'react'
import gsap from 'gsap'
import { hasWebGL, prefersReducedMotion } from '../hooks/useCapabilities'
import { useInView } from '../hooks/useInView'
import Magnetic from '../components/Magnetic'
import FoodArt from '../components/FoodArt'
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
  // Gentle mouse parallax for the floating dishes (desktop only).
  const move = (e: RPE<HTMLElement>) => {
    if (e.pointerType !== 'mouse' || prefersReducedMotion() || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    ref.current.style.setProperty('--mx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3))
    ref.current.style.setProperty('--my', ((e.clientY - r.top) / r.height - 0.5).toFixed(3))
  }
  return (
    <section id="top" ref={ref} onPointerMove={move} className="relative isolate flex min-h-[100svh] items-end overflow-hidden pb-20 md:items-center md:pb-0"
      style={{ background: 'radial-gradient(60% 50% at 70% 40%, rgba(212,175,55,.16), transparent 70%), radial-gradient(40% 40% at 8% 92%, rgba(159,216,232,.08), transparent 70%), #08070a' }}>
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        {gl ? <Suspense fallback={null}><HeroScene active={inView} /></Suspense> : <div className="mx-auto grid h-full w-56 place-items-center"><FoodArt category="pizza" className="h-48 w-48" /></div>}
      </div>
      <div className="par" style={{ right: '6%', top: '15%', width: 92, height: 92 }}><div className="fl h-full w-full"><FoodArt category="mocktails" color="#9fd8e8" className="h-full w-full" /></div></div>
      <div className="par hidden sm:block" style={{ left: '6%', top: '22%', width: 84, height: 84 }}><div className="fl h-full w-full" style={{ animationDelay: '-2s' }}><FoodArt category="burgers" className="h-full w-full" /></div></div>
      <div className="par hidden sm:block" style={{ right: '15%', top: '55%', width: 72, height: 72 }}><div className="fl h-full w-full" style={{ animationDelay: '-3.5s' }}><FoodArt category="fries" className="h-full w-full" /></div></div>
      <div ref={text} className="mx-auto w-full max-w-6xl px-6">
        <p className="hero-line eyebrow">Pizza Valley &middot; Ice Bar</p>
        <h1 className="hero-line mt-4 max-w-xl text-5xl font-extrabold leading-[1.05] md:text-7xl">Taste the Happiness. <span className="gt">Feel the Chill.</span></h1>
        <div className="hero-line rule" />
        <p className="hero-line mt-5 max-w-md muted">Hot pizza from the Valley, cold mocktails from the Ice Bar.</p>
        <div className="hero-line mt-8 flex flex-wrap gap-3">
          <Magnetic><a href="#menu" className="btn btn-ember">Explore Menu</a></Magnetic>
          <Magnetic><a href="#ice-bar" className="btn btn-ghost">Visit the Ice Bar</a></Magnetic>
        </div>
      </div>
      <span className="cue" aria-hidden="true" />
    </section>
  )
}
