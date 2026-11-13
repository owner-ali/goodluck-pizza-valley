import { lazy, Suspense, useEffect, useRef, useState } from 'react'
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
  return (
    <section id="top" ref={ref} className="relative isolate flex min-h-[100svh] items-end overflow-hidden pb-16 md:items-center md:pb-0">
      <div className="orb -z-10" style={{ width: 340, height: 340, background: '#ff4d6d', left: -80, top: '10%' }} />
      <div className="orb -z-10" style={{ width: 300, height: 300, background: '#22d3ee', right: -60, top: '30%', animationDelay: '-5s' }} />
      <div className="orb -z-10" style={{ width: 260, height: 260, background: '#8b5cf6', left: '40%', bottom: -80, animationDelay: '-8s' }} />
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        {gl ? <Suspense fallback={null}><HeroScene active={inView} /></Suspense> : <div className="mx-auto grid h-full w-56 place-items-center"><FoodArt category="pizza" className="h-48 w-48" /></div>}
      </div>
      <div className="fl" style={{ right: '5%', top: '16%', width: 96, height: 96 }}><FoodArt category="mocktails" color="#22d3ee" className="h-full w-full" /></div>
      <div className="fl hidden sm:block" style={{ left: '6%', top: '22%', width: 84, height: 84, animationDelay: '-2s' }}><FoodArt category="burgers" className="h-full w-full" /></div>
      <div className="fl hidden sm:block" style={{ right: '14%', top: '52%', width: 76, height: 76, animationDelay: '-3.5s' }}><FoodArt category="fries" className="h-full w-full" /></div>
      <div ref={text} className="mx-auto w-full max-w-6xl px-6">
        <h1 className="hero-line max-w-xl text-5xl font-extrabold leading-[1.05] md:text-7xl">Taste the Happiness. <span className="gt">Feel the Chill.</span></h1>
        <p className="hero-line mt-4 max-w-md muted">Hot pizza from the Valley, cold mocktails from the Ice Bar.</p>
        <div className="hero-line mt-8 flex flex-wrap gap-3">
          <Magnetic><a href="#menu" className="btn btn-ember">Explore Menu</a></Magnetic>
          <Magnetic><a href="#ice-bar" className="btn btn-frost">Visit the Ice Bar</a></Magnetic>
        </div>
      </div>
    </section>
  )
}
