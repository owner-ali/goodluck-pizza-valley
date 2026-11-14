import { useRef, type CSSProperties, type PointerEvent as RPE } from 'react'
import { Link } from 'react-router-dom'
import { Flame, Leaf } from 'lucide-react'
import type { MenuItem } from '../data/types'
import { formatPKR, minPrice, savePct } from '../lib/pricing'
import { prefersReducedMotion } from '../hooks/useCapabilities'
import FoodPic from './FoodPic'

export default function FoodCard({ item, world, onOpen }: { item: MenuItem; world: 'pizza' | 'ice'; onOpen: (i: MenuItem) => void }) {
  const ref = useRef<HTMLElement>(null)
  const move = (e: RPE<HTMLElement>) => {
    if (e.pointerType !== 'mouse' || prefersReducedMotion()) return
    const r = ref.current!.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5
    ref.current!.style.transform = `perspective(700px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`
  }
  const accent = world === 'ice' ? '#9fd8e8' : '#d4af37'
  const pct = savePct(item)
  return (
    <article ref={ref} onPointerMove={move} onPointerLeave={() => { if (ref.current) ref.current.style.transform = '' }}
      className="food-card glass flex flex-col p-3 sm:p-4" style={{ '--accent': accent } as CSSProperties}>
      <div className="plate relative grid h-28 place-items-center rounded-2xl sm:h-36">
        <FoodPic id={item.id} image={item.image} category={item.categoryId} color={item.color} imgClass="emoji h-20 w-20 rounded-full object-cover sm:h-28 sm:w-28" artClass="emoji h-20 w-20 sm:h-28 sm:w-28" />
        <div className="absolute left-2 top-2 flex gap-1 text-xs">
          {item.popular && <span className="rounded-full bg-champagne px-2 py-0.5 font-bold text-black">Popular</span>}
          {item.veg && <span title="Vegetarian" aria-label="Vegetarian" className="rounded-full bg-green-600 p-1"><Leaf size={12} /></span>}
          {item.spicy && <span title="Spicy" aria-label="Spicy" className="rounded-full bg-red-600 p-1"><Flame size={12} /></span>}
        </div>
        {pct > 0 && <span className="absolute right-2 top-2 rounded-full bg-ember px-2 py-0.5 text-xs font-bold text-black">Save {pct}%</span>}
      </div>
      <h3 className="mt-3 text-base font-bold sm:text-xl"><Link to={`/food/${item.id}`} className="hover:text-champagne">{item.name}</Link></h3>
      <p className="mt-1 line-clamp-2 text-xs muted sm:text-sm">{item.description}</p>
      <div className="mt-auto pt-3">
        <p className="font-bold text-champagne">
          {item.sizes.length > 1 && <span className="mr-1 text-xs font-normal muted">From</span>}
          {pct > 0 && <s className="mr-1.5 text-xs font-normal muted">{formatPKR(item.compareAt as number)}</s>}
          {formatPKR(minPrice(item))}
        </p>
        <button className={`btn ${world === 'ice' ? 'btn-frost' : 'btn-ember'} mt-2 w-full justify-center !px-4 !py-2 text-sm`} disabled={!item.available} onClick={() => onOpen(item)}>
          {item.available ? 'Add' : 'Sold out'}
        </button>
      </div>
    </article>
  )
}
