import { useRef, type CSSProperties, type PointerEvent as RPE } from 'react'
import { Link } from 'react-router-dom'
import { Flame, Leaf } from 'lucide-react'
import type { MenuItem } from '../data/types'
import { formatPKR, minPrice } from '../lib/pricing'
import { prefersReducedMotion } from '../hooks/useCapabilities'
import FoodPic from './FoodPic'

export default function FoodCard({ item, world, onOpen }: { item: MenuItem; world: 'pizza' | 'ice'; onOpen: (i: MenuItem) => void }) {
  const ref = useRef<HTMLElement>(null)
  const move = (e: RPE<HTMLElement>) => {
    if (e.pointerType !== 'mouse' || prefersReducedMotion()) return
    const r = ref.current!.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5
    ref.current!.style.transform = `perspective(700px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg)`
  }
  const accent = world === 'ice' ? '#38e8ff' : '#ff6a1a'
  return (
    <article ref={ref} onPointerMove={move} onPointerLeave={() => { if (ref.current) ref.current.style.transform = '' }}
      className="food-card glass flex flex-col p-4" style={{ '--accent': accent } as CSSProperties}>
      <div className="plate relative grid h-36 place-items-center rounded-2xl">
        <FoodPic id={item.id} image={item.image} category={item.categoryId} color={item.color} imgClass="emoji h-28 w-28 rounded-full object-cover" artClass="emoji h-28 w-28" />
        <div className="absolute left-2 top-2 flex gap-1 text-xs">
          {item.popular && <span className="rounded-full bg-champagne px-2 py-0.5 font-bold text-black">Popular</span>}
          {item.veg && <span title="Vegetarian" aria-label="Vegetarian" className="rounded-full bg-green-600 p-1"><Leaf size={12} /></span>}
          {item.spicy && <span title="Spicy" aria-label="Spicy" className="rounded-full bg-red-600 p-1"><Flame size={12} /></span>}
        </div>
      </div>
      <h3 className="mt-3 text-xl font-bold"><Link to={`/food/${item.id}`} className="hover:text-champagne">{item.name}</Link></h3>
      <p className="mt-1 line-clamp-2 text-sm muted">{item.description}</p>
      <div className="mt-auto flex items-center justify-between gap-2 pt-4">
        <span className="font-bold text-champagne">From {formatPKR(minPrice(item))}</span>
        <button className={`btn ${world === 'ice' ? 'btn-frost' : 'btn-ember'} !px-4 !py-2 text-sm`} disabled={!item.available} onClick={() => onOpen(item)}>
          {item.available ? 'Customize' : 'Sold out'}
        </button>
      </div>
    </article>
  )
}
