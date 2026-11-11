import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

// Cart lives in localStorage (demo/free). The SERVER re-prices every order from the database.
export interface CartLine { key: string; itemId: string; name: string; size: string; sizeId: string; addons: string[]; addonIds: string[]; qty: number; unitPrice: number }
interface Ctx {
  lines: CartLine[]; count: number; subtotal: number; open: boolean
  setOpen: (o: boolean) => void; add: (l: CartLine) => void; setQty: (key: string, qty: number) => void
  remove: (key: string) => void; clear: () => void; toast: (m: string) => void
}
const KEY = 'glpv_cart_v2'
const CartCtx = createContext<Ctx | null>(null)

function load(): CartLine[] {
  try { const v = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(v) ? v.filter((l) => l && l.sizeId && l.qty > 0) : [] } catch { return [] }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(load)
  const [open, setOpen] = useState(false)
  const [msg, setMsg] = useState('')
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(lines)) } catch { /* storage blocked */ } }, [lines])
  useEffect(() => { if (!msg) return; const t = setTimeout(() => setMsg(''), 2600); return () => clearTimeout(t) }, [msg])
  const add = useCallback((l: CartLine) => setLines((s) => {
    const hit = s.find((x) => x.key === l.key)
    return hit ? s.map((x) => (x.key === l.key ? { ...x, qty: Math.min(20, x.qty + l.qty) } : x)) : [...s, l]
  }), [])
  const setQty = useCallback((key: string, qty: number) => setLines((s) => s.map((x) => (x.key === key ? { ...x, qty: Math.min(20, Math.max(1, qty)) } : x))), [])
  const remove = useCallback((key: string) => setLines((s) => s.filter((x) => x.key !== key)), [])
  const clear = useCallback(() => setLines([]), [])
  const value = useMemo(() => ({
    lines, count: lines.reduce((t, l) => t + l.qty, 0), subtotal: lines.reduce((t, l) => t + l.qty * l.unitPrice, 0),
    open, setOpen, add, setQty, remove, clear, toast: setMsg,
  }), [lines, open, add, setQty, remove, clear])
  return (
    <CartCtx.Provider value={value}>
      {children}
      <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-4 z-[70] flex justify-center px-4">
        {msg && <div className="glass bg-black/80 px-4 py-2 text-sm">{msg}</div>}
      </div>
    </CartCtx.Provider>
  )
}
export function useCart() {
  const c = useContext(CartCtx)
  if (!c) throw new Error('useCart must be used inside CartProvider')
  return c
}
