import { lazy, Suspense, useEffect, useState } from 'react'
import type { MenuItem } from '../data/types'
import type { MenuState } from '../hooks/useMenu'
import { useInView } from '../hooks/useInView'
import { hasWebGL } from '../hooks/useCapabilities'
import { formatPKR, minPrice } from '../lib/pricing'
import FoodArt from '../components/FoodArt'
const IceScene = lazy(() => import('../three/IceScene'))

export default function IceBar({ menu, onOpen }: { menu: MenuState; onOpen: (i: MenuItem) => void }) {
  const { ref, inView, seen } = useInView<HTMLDivElement>()
  const [gl, setGl] = useState(false)
  const [sel, setSel] = useState<string | null>(null)
  useEffect(() => setGl(hasWebGL()), [])
  const iceCats = new Set(menu.data?.categories.filter((c) => c.world === 'ice' && c.id !== 'cold-drinks').map((c) => c.id))
  const drinks = (menu.data?.items ?? []).filter((i) => iceCats.has(i.categoryId) && i.available)
  const current = drinks.find((d) => d.id === sel) ?? drinks[0]

  return (
    <section id="ice-bar" className="world-ice relative overflow-hidden px-6 py-20" style={{ background: 'radial-gradient(60% 50% at 50% 0%, rgba(159,216,232,.16), transparent 70%), #060d14' }}>
      <div className="bubbles pointer-events-none absolute inset-0" aria-hidden="true">
        {Array.from({ length: 12 }, (_, k) => <i key={k} style={{ left: `${k * 8.3 + 2}%`, width: 6 + (k % 4) * 5, height: 6 + (k % 4) * 5, animationDuration: `${9 + (k % 5) * 2.4}s`, animationDelay: `${-k * 1.7}s` }} />)}
      </div>
      <div className="relative mx-auto max-w-6xl">
        <p className="eyebrow !text-frost">Cold &amp; refreshing</p>
        <h2 className="gt2 mt-2 text-4xl font-bold md:text-5xl">The Ice Bar</h2>
        <div className="rule" style={{ background: 'linear-gradient(90deg, #9fd8e8, transparent)' }} />
        <p className="mt-4 max-w-md muted">Pick a drink and watch the glass change colour. Sample drinks and prices.</p>

        <div ref={ref} className="mt-6 h-[46svh] min-h-[300px] md:h-[480px]" aria-label="3D view of the selected drink">
          {seen && gl && current
            ? <Suspense fallback={null}><IceScene color={current.color ?? '#9fd8e8'} active={inView} /></Suspense>
            : <div className="grid h-full place-items-center"><FoodArt category="mocktails" color={current?.color} className="h-48 w-48" /></div>}
        </div>

        {menu.status === 'error' && <p className="glass p-4">{menu.error} <button className="underline" onClick={menu.reload}>Try again</button></p>}
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {drinks.map((d) => (
            <div key={d.id} className={`glass p-4 transition-all duration-300 ${current?.id === d.id ? '!border-[#9fd8e8] shadow-[0_0_32px_rgba(159,216,232,.22)]' : ''}`}>
              <button className="flex w-full items-center gap-3 text-left" aria-pressed={current?.id === d.id} onClick={() => setSel(d.id)}>
                <FoodArt category={d.categoryId} color={d.color} className="h-14 w-14 shrink-0" />
                <span><b className="text-lg">{d.name}</b><span className="mt-1 block text-sm muted">{d.description}</span></span>
              </button>
              <div className="mt-3 flex items-center justify-between"><span className="font-bold text-champagne">From {formatPKR(minPrice(d))}</span>
                <button className="btn btn-frost !px-4 !py-2 text-sm" onClick={() => onOpen(d)}>Customize</button></div>
            </div>))}
        </div>
      </div>
    </section>
  )
}
