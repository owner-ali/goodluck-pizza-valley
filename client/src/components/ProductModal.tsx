import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Plus, X } from 'lucide-react'
import type { MenuItem } from '../data/types'
import { clampQty, formatPKR, lineTotal } from '../lib/pricing'
import { useCart } from '../context/CartContext'

function Body({ item, onClose }: { item: MenuItem; onClose: () => void }) {
  const { add, toast } = useCart()
  const [sizeId, setSizeId] = useState(item.sizes[0].id)
  const [picked, setPicked] = useState<string[]>([])
  const [qty, setQty] = useState(1)
  const panel = useRef<HTMLDivElement>(null)
  const total = lineTotal(item, sizeId, picked, qty)

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null
    panel.current?.querySelector<HTMLElement>('button')?.focus()
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return onClose()
      if (e.key !== 'Tab' || !panel.current) return
      const f = panel.current.querySelectorAll<HTMLElement>('button:not([disabled]),input')
      const first = f[0], last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; prev?.focus() }
  }, [onClose])

  const groups = item.addons.reduce<Record<string, typeof item.addons>>((g, a) => { (g[a.group ?? 'Add-ons'] ||= []).push(a); return g }, {})
  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))

  const submit = () => {
    const size = item.sizes.find((s) => s.id === sizeId)!
    const chosen = item.addons.filter((a) => picked.includes(a.id))
    add({ key: [item.id, sizeId, ...picked.slice().sort()].join('|'), itemId: item.id, name: item.name, size: size.label,
      sizeId, addonIds: picked, addons: chosen.map((a) => a.label), qty, unitPrice: total / qty })
    toast(`${qty} x ${item.name} added to cart`)
    onClose()
  }

  return (
    <motion.div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 md:items-center md:p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div ref={panel} role="dialog" aria-modal="true" aria-labelledby="pm-title" onClick={(e) => e.stopPropagation()}
        initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
        className="max-h-[92svh] w-full overflow-y-auto rounded-t-3xl border border-white/15 bg-[#14110f] p-5 md:max-w-lg md:rounded-3xl">
        <div className="flex items-start justify-between gap-3">
          <div><h2 id="pm-title" className="text-2xl font-bold">{item.emoji} {item.name}</h2><p className="mt-1 text-sm muted">{item.description}</p></div>
          <button aria-label="Close" className="rounded-full border border-white/20 p-2" onClick={onClose}><X size={18} /></button>
        </div>
        <fieldset className="mt-5"><legend className="mb-2 font-bold text-champagne">Size</legend>
          <div className="grid gap-2">{item.sizes.map((s) => (
            <label key={s.id} className={`flex cursor-pointer justify-between rounded-xl border p-3 ${sizeId === s.id ? 'border-[color:var(--ember)] bg-white/10' : 'border-white/15'}`}>
              <span><input className="mr-2" type="radio" name="size" checked={sizeId === s.id} onChange={() => setSizeId(s.id)} />{s.label}</span><span>{formatPKR(s.price)}</span>
            </label>))}</div>
        </fieldset>
        {Object.entries(groups).map(([g, list]) => (
          <fieldset key={g} className="mt-5"><legend className="mb-2 font-bold text-champagne">{g}</legend>
            <div className="grid gap-2">{list.map((a) => (
              <label key={a.id} className={`flex cursor-pointer justify-between rounded-xl border p-3 ${picked.includes(a.id) ? 'border-[color:var(--frost)] bg-white/10' : 'border-white/15'}`}>
                <span><input className="mr-2" type="checkbox" checked={picked.includes(a.id)} onChange={() => toggle(a.id)} />{a.label}</span><span>{a.price ? `+ ${formatPKR(a.price)}` : 'Free'}</span>
              </label>))}</div>
          </fieldset>))}
        <div className="mt-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3" role="group" aria-label="Quantity">
            <button aria-label="Decrease quantity" className="rounded-full border border-white/20 p-2" onClick={() => setQty(clampQty(qty - 1))}><Minus size={16} /></button>
            <span aria-live="polite" className="w-6 text-center font-bold">{qty}</span>
            <button aria-label="Increase quantity" className="rounded-full border border-white/20 p-2" onClick={() => setQty(clampQty(qty + 1))}><Plus size={16} /></button>
          </div>
          <button className="btn btn-ember" onClick={submit}>Add to cart - {formatPKR(total)}</button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function ProductModal({ item, onClose }: { item: MenuItem | null; onClose: () => void }) {
  return <AnimatePresence>{item && <Body key={item.id} item={item} onClose={onClose} />}</AnimatePresence>
}
