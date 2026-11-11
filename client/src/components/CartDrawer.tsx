import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Plus, Trash2, X } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatPKR } from '../lib/pricing'

export default function CartDrawer() {
  const { open, setOpen, lines, subtotal, setQty, remove } = useCart()
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, setOpen])
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 bg-black/70" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
          <motion.aside role="dialog" aria-modal="true" aria-label="Your cart" onClick={(e) => e.stopPropagation()}
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.25 }}
            className="ml-auto flex h-full w-full max-w-md flex-col bg-[#14110f] p-5">
            <div className="flex items-center justify-between"><h2 className="text-2xl font-bold">Your cart</h2>
              <button autoFocus aria-label="Close cart" className="rounded-full border border-white/20 p-2" onClick={() => setOpen(false)}><X size={18} /></button></div>
            {lines.length === 0 ? (
              <div className="mt-10 text-center"><p className="muted">Your cart is empty.</p>
                <Link to="/#menu" className="btn btn-ember mt-4" onClick={() => setOpen(false)}>Browse the menu</Link></div>
            ) : (<>
              <ul className="mt-4 flex-1 divide-y divide-white/10 overflow-y-auto">
                {lines.map((l) => (
                  <li key={l.key} className="py-3">
                    <div className="flex justify-between gap-3"><b>{l.name}</b><span>{formatPKR(l.unitPrice * l.qty)}</span></div>
                    <p className="text-sm muted">{l.size}{l.addons.length ? ` + ${l.addons.join(', ')}` : ''}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <button aria-label={`Decrease ${l.name}`} className="rounded-full border border-white/20 p-1.5" onClick={() => setQty(l.key, l.qty - 1)}><Minus size={14} /></button>
                      <span className="w-5 text-center">{l.qty}</span>
                      <button aria-label={`Increase ${l.name}`} className="rounded-full border border-white/20 p-1.5" onClick={() => setQty(l.key, l.qty + 1)}><Plus size={14} /></button>
                      <button aria-label={`Remove ${l.name}`} className="ml-auto text-red-300" onClick={() => remove(l.key)}><Trash2 size={18} /></button>
                    </div>
                  </li>))}
              </ul>
              <div className="border-t border-white/10 pt-4">
                <div className="flex justify-between text-lg font-bold"><span>Subtotal</span><span className="text-champagne">{formatPKR(subtotal)}</span></div>
                <p className="mt-1 text-xs muted">Delivery fee, if any, is added at checkout.</p>
                <Link to="/checkout" className="btn btn-ember mt-4 w-full justify-center" onClick={() => setOpen(false)}>Go to checkout</Link>
              </div></>)}
          </motion.aside>
        </motion.div>)}
    </AnimatePresence>
  )
}
