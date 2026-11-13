import { useMemo, useState } from 'react'
import { Leaf, Search } from 'lucide-react'
import type { MenuItem } from '../data/types'
import type { MenuState } from '../hooks/useMenu'
import { applyFilters, type Filters } from '../lib/pricing'
import FoodCard from '../components/FoodCard'

export default function MenuBrowser({ menu, onOpen }: { menu: MenuState; onOpen: (i: MenuItem) => void }) {
  const [f, setF] = useState<Filters>({ categoryId: 'pizza', query: '', vegOnly: false, maxPrice: null, sort: 'popular' })
  const set = (p: Partial<Filters>) => setF((s) => ({ ...s, ...p }))
  const items = useMemo(() => (menu.data ? applyFilters(menu.data.items, f) : []), [menu.data, f])
  const world = (id: string) => menu.data?.categories.find((c) => c.id === id)?.world ?? 'pizza'
  const field = 'rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm'

  return (
    <section id="menu" className="world-pizza mx-auto max-w-6xl px-6 py-16">
      <p className="eyebrow">Our kitchen</p>
      <h2 className="mt-2 text-4xl font-bold md:text-5xl">The <span className="gt">Menu</span></h2>
      <div className="rule" />
      <p className="mt-2 text-sm muted">Sample menu: names and prices (PKR) are placeholders until the owner edits them.</p>

      <div className="-mx-6 mt-6 flex gap-2 overflow-x-auto px-6 pb-2" role="group" aria-label="Categories">
        {[{ id: 'all', name: 'All' }, ...(menu.data?.categories ?? [])].map((c) => (
          <button key={c.id} aria-pressed={f.categoryId === c.id} onClick={() => set({ categoryId: c.id })}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm ${f.categoryId === c.id ? 'border-ember bg-ember font-bold text-black' : 'border-white/20'}`}>{c.name}</button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="relative min-w-[200px] flex-1"><span className="sr-only">Search the menu</span>
          <Search size={16} className="absolute left-3 top-3 muted" />
          <input type="search" value={f.query} onChange={(e) => set({ query: e.target.value })} placeholder="Search dishes" className={`${field} w-full pl-9`} /></label>
        <button aria-pressed={f.vegOnly} onClick={() => set({ vegOnly: !f.vegOnly })} className={`${field} flex items-center gap-1 ${f.vegOnly ? '!border-green-500 bg-green-600/30' : ''}`}><Leaf size={14} />Vegetarian</button>
        <label><span className="sr-only">Maximum price</span>
          <select className={field} value={f.maxPrice ?? ''} onChange={(e) => set({ maxPrice: e.target.value ? Number(e.target.value) : null })}>
            <option value="">Any price</option><option value="500">Up to Rs 500</option><option value="1000">Up to Rs 1,000</option><option value="2000">Up to Rs 2,000</option>
          </select></label>
        <label><span className="sr-only">Sort by</span>
          <select className={field} value={f.sort} onChange={(e) => set({ sort: e.target.value as Filters['sort'] })}>
            <option value="popular">Popular first</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="name">Name A-Z</option>
          </select></label>
      </div>

      <p className="mt-4 text-sm muted" aria-live="polite">{menu.status === 'ready' ? `${items.length} item${items.length === 1 ? '' : 's'}` : ''}</p>

      {menu.status === 'loading' && <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[0, 1, 2].map((i) => <div key={i} className="glass h-72 animate-pulse" />)}</div>}
      {menu.status === 'error' && <div className="glass mt-4 p-6"><p>{menu.error}</p><button className="btn btn-ember mt-4" onClick={menu.reload}>Try again</button></div>}
      {menu.status === 'ready' && items.length === 0 && (
        <div className="glass mt-4 p-6"><p>No dishes match those filters.</p>
          <button className="btn btn-frost mt-4" onClick={() => setF({ categoryId: 'all', query: '', vegOnly: false, maxPrice: null, sort: 'popular' })}>Clear filters</button></div>)}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((i) => <FoodCard key={i.id} item={i} world={world(i.categoryId)} onOpen={onOpen} />)}
      </div>
    </section>
  )
}
