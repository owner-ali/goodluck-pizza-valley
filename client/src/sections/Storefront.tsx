import { useEffect, useMemo, useRef, useState } from 'react'
import { Leaf, Search } from 'lucide-react'
import type { MenuItem } from '../data/types'
import type { MenuState } from '../hooks/useMenu'
import FoodCard from '../components/FoodCard'

// Food-delivery style menu: sticky category tabs that follow your scroll, one section per category.
export default function Storefront({ menu, onOpen }: { menu: MenuState; onOpen: (i: MenuItem) => void }) {
  const [q, setQ] = useState('')
  const [veg, setVeg] = useState(false)
  const [active, setActive] = useState('')
  const tabs = useRef<HTMLDivElement>(null)

  const groups = useMemo(() => {
    const data = menu.data
    if (!data) return []
    const needle = q.trim().toLowerCase()
    return data.categories.map((cat) => ({
      cat,
      items: data.items.filter((i) => i.categoryId === cat.id && (!veg || i.veg) && (!needle || `${i.name} ${i.description}`.toLowerCase().includes(needle))),
    })).filter((g) => g.items.length > 0)
  }, [menu.data, q, veg])

  useEffect(() => {
    const els = groups.map((g) => document.getElementById('cat-' + g.cat.id)).filter(Boolean) as HTMLElement[]
    if (!els.length) return
    const io = new IntersectionObserver((es) => {
      const vis = es.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (vis.length) setActive(vis[0].target.id.slice(4))
    }, { rootMargin: '-130px 0px -65% 0px' })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [groups])

  useEffect(() => { tabs.current?.querySelector('[aria-current="true"]')?.scrollIntoView({ inline: 'center', block: 'nearest' }) }, [active])

  const go = (id: string) => document.getElementById('cat-' + id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const field = 'rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm'

  return (
    <section id="menu" className="mx-auto max-w-6xl pb-16 pt-12">
      <div className="px-6">
        <p className="eyebrow">Order online</p>
        <h2 className="mt-2 text-4xl font-bold md:text-5xl">The <span className="gt">Menu</span></h2>
        <div className="rule" />
        <p className="mt-3 text-sm muted">Sample menu: names, deals and PKR prices are placeholders until the owner edits them.</p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <label className="relative min-w-[200px] flex-1"><span className="sr-only">Search the menu</span>
            <Search size={16} className="absolute left-4 top-3 muted" />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search dishes" className={`${field} w-full pl-10`} /></label>
          <button aria-pressed={veg} onClick={() => setVeg(!veg)} className={`${field} flex items-center gap-1.5 ${veg ? '!border-green-500 bg-green-600/30' : ''}`}><Leaf size={14} />Vegetarian</button>
        </div>
      </div>

      {menu.status === 'ready' && groups.length > 0 && (
        <div className="sticky top-[3.5rem] z-20 mt-5 border-y border-white/10 bg-coal/90 backdrop-blur">
          <div ref={tabs} className="flex gap-2 overflow-x-auto px-6 py-3" role="navigation" aria-label="Menu categories">
            {groups.map((g) => (
              <a key={g.cat.id} href={`#cat-${g.cat.id}`} onClick={(e) => { e.preventDefault(); go(g.cat.id) }}
                aria-current={active === g.cat.id ? 'true' : undefined}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm transition-colors ${active === g.cat.id ? 'border-ember bg-ember font-bold text-black' : 'border-white/20 hover:border-ember'}`}>
                {g.cat.id === 'deals' ? '🔥 ' : ''}{g.cat.name}
              </a>))}
          </div>
        </div>)}

      <div className="px-6">
        {menu.status === 'loading' && <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">{[0, 1, 2, 3].map((i) => <div key={i} className="glass h-64 animate-pulse" />)}</div>}
        {menu.status === 'error' && <div className="glass mt-6 p-6"><p>{menu.error}</p><button className="btn btn-ember mt-4" onClick={menu.reload}>Try again</button></div>}
        {menu.status === 'ready' && groups.length === 0 && (
          <div className="glass mt-6 p-6"><p>No dishes match that search.</p>
            <button className="btn btn-ghost mt-4" onClick={() => { setQ(''); setVeg(false) }}>Clear search</button></div>)}
        {groups.map((g) => (
          <section key={g.cat.id} id={`cat-${g.cat.id}`} className="scroll-mt-32 pt-8">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-2xl font-bold">{g.cat.id === 'deals' ? '🔥 ' : ''}{g.cat.name}</h3>
              <span className="text-sm muted">{g.items.length} item{g.items.length === 1 ? '' : 's'}</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {g.items.map((i) => <FoodCard key={i.id} item={i} world={g.cat.world} onOpen={onOpen} />)}
            </div>
          </section>))}
      </div>
    </section>
  )
}
