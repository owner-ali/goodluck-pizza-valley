import type { CSSProperties } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { MenuItem } from '../data/types'
import type { MenuState } from '../hooks/useMenu'
import { useTitle } from '../hooks/useTitle'
import { formatPKR } from '../lib/pricing'
import FoodPic from '../components/FoodPic'

export default function FoodDetailPage({ menu, onOpen }: { menu: MenuState; onOpen: (i: MenuItem) => void }) {
  const { id } = useParams()
  const item = menu.data?.items.find((i) => i.id === id)
  useTitle(item ? `${item.name} | Good Luck Pizza Valley & Ice Bar` : 'Food | Good Luck Pizza Valley & Ice Bar', item?.description)
  if (menu.status === 'loading') return <div className="mx-auto max-w-3xl px-6 py-16"><div className="glass h-72 animate-pulse" /></div>
  if (!item) return <section className="px-6 py-24 text-center"><h1 className="text-3xl font-bold">We couldn't find that dish</h1><Link className="btn btn-ember mt-6" to="/#menu">Back to the menu</Link></section>
  return (
    <section className="mx-auto grid max-w-4xl gap-8 px-6 py-12 md:grid-cols-2">
      <div className="plate grid min-h-64 place-items-center rounded-3xl" style={{ '--accent': '#ff6a1a' } as CSSProperties}>
        <FoodPic id={item.id} image={item.image} emoji={item.emoji} alt={item.name} imgClass="h-56 w-56 rounded-full object-cover" emojiClass="text-9xl" />
      </div>
      <div>
        <h1 className="text-4xl font-bold">{item.name}</h1>
        <p className="mt-3 muted">{item.description}</p>
        <p className="mt-2 text-sm">{item.veg ? 'Vegetarian' : 'Contains meat'}{item.spicy ? ' - Spicy' : ''}</p>
        <h2 className="mt-5 text-lg font-bold text-champagne">Sizes</h2>
        <ul>{item.sizes.map((s) => <li key={s.id} className="flex justify-between border-b border-white/10 py-1"><span>{s.label}</span><span>{formatPKR(s.price)}</span></li>)}</ul>
        {item.addons.length > 0 && <p className="mt-3 text-sm muted">Add-ons: {item.addons.map((a) => a.label).join(', ')}</p>}
        <button className="btn btn-ember mt-6" disabled={!item.available} onClick={() => onOpen(item)}>{item.available ? 'Customize and add to cart' : 'Sold out'}</button>
      </div>
    </section>)
}
