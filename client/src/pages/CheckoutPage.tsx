import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useTitle } from '../hooks/useTitle'
import { apiConfigured, getConfig, placeOrder } from '../services/orderService'
import { isPhone } from '../lib/validate'
import { formatPKR } from '../lib/pricing'
import { getPref } from '../lib/pref'
import Field, { inputCls } from '../components/Field'

export default function CheckoutPage() {
  useTitle('Checkout | Good Luck Pizza Valley & Ice Bar', 'Place your order for delivery or pickup. Cash on delivery.')
  const { lines, subtotal, clear } = useCart()
  const [f, setF] = useState(() => { const p = getPref(); return { name: '', phone: '', type: p.mode, address: p.area, notes: '' } })
  const [err, setErr] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)
  const [fail, setFail] = useState('')
  const [done, setDone] = useState<{ orderId: string; total: number } | null>(null)
  const [fee, setFee] = useState<number | null>(null)
  useEffect(() => { getConfig().then((c) => setFee(c ? c.deliveryFee : null)) }, [])
  const set = (p: Partial<typeof f>) => setF((s) => ({ ...s, ...p }))

  const submit = async (ev: FormEvent) => {
    ev.preventDefault()
    const e: Record<string, string> = {}
    if (f.name.trim().length < 2) e.name = 'Enter your full name.'
    if (!isPhone(f.phone)) e.phone = 'Enter a valid phone number, for example 03001234567.'
    if (f.type === 'delivery' && f.address.trim().length < 8) e.address = 'Enter your full delivery address.'
    setErr(e)
    if (Object.keys(e).length) return
    setBusy(true); setFail('')
    try {
      const r = await placeOrder({ customer: { name: f.name, phone: f.phone }, type: f.type, address: f.address, notes: f.notes,
        lines: lines.map((l) => ({ itemId: l.itemId, sizeId: l.sizeId, addonIds: l.addonIds, qty: l.qty })) })
      clear(); setDone(r)
    } catch (x) { setFail((x as Error).message) } finally { setBusy(false) }
  }

  if (done) return (
    <section className="mx-auto max-w-xl px-6 py-16 text-center">
      <h1 className="text-4xl font-bold">Order received</h1>
      <p className="mt-3">Your order ID is <b className="text-champagne">{done.orderId}</b>. Save it to track your order.</p>
      <p className="mt-2">Total to pay: <b>{formatPKR(done.total)}</b> (cash on {f.type === 'delivery' ? 'delivery' : 'pickup'}).</p>
      <Link className="btn btn-ember mt-6" to={`/track?id=${done.orderId}`}>Track my order</Link>
    </section>)

  if (lines.length === 0) return (
    <section className="mx-auto max-w-xl px-6 py-16 text-center"><h1 className="text-3xl font-bold">Your cart is empty</h1>
      <Link className="btn btn-ember mt-6" to="/#menu">Browse the menu</Link></section>)

  const delivery = f.type === 'delivery' && fee ? fee : 0
  return (
    <section className="mx-auto grid max-w-5xl gap-8 px-6 py-12 md:grid-cols-[1fr_340px]">
      <form onSubmit={submit} noValidate className="space-y-4">
        <h1 className="text-4xl font-bold">Checkout</h1>
        {!apiConfigured && <p role="alert" className="glass p-4 text-sm">Orders can't be saved yet because the server is not connected. Set <code>VITE_API_URL</code> in <code>client/.env</code> and start the server.</p>}
        <Field id="name" label="Full name" error={err.name}><input id="name" className={inputCls} autoComplete="name" value={f.name} onChange={(e) => set({ name: e.target.value })} aria-invalid={!!err.name} /></Field>
        <Field id="phone" label="Phone" error={err.phone}><input id="phone" className={inputCls} type="tel" autoComplete="tel" value={f.phone} onChange={(e) => set({ phone: e.target.value })} aria-invalid={!!err.phone} /></Field>
        <fieldset><legend className="mb-1 text-sm font-bold">How do you want your order?</legend>
          <div className="grid grid-cols-2 gap-2">{(['delivery', 'pickup'] as const).map((t) => (
            <label key={t} className={`cursor-pointer rounded-xl border p-3 text-center capitalize ${f.type === t ? 'border-ember bg-white/10' : 'border-white/15'}`}>
              <input className="sr-only" type="radio" name="type" checked={f.type === t} onChange={() => set({ type: t })} />{t}</label>))}</div></fieldset>
        {f.type === 'delivery' && <Field id="address" label="Delivery address" error={err.address}><textarea id="address" rows={3} className={inputCls} autoComplete="street-address" value={f.address} onChange={(e) => set({ address: e.target.value })} aria-invalid={!!err.address} /></Field>}
        <Field id="notes" label="Notes (optional)"><textarea id="notes" rows={2} maxLength={300} className={inputCls} value={f.notes} onChange={(e) => set({ notes: e.target.value })} /></Field>
        <p className="text-sm muted">Payment: cash on {f.type === 'delivery' ? 'delivery' : 'pickup'}.</p>
        {fail && <p role="alert" className="rounded-xl border border-red-400/50 bg-red-500/10 p-3 text-sm">{fail}</p>}
        <button className="btn btn-ember" disabled={busy || !apiConfigured}>{busy ? 'Placing order...' : 'Place order'}</button>
      </form>
      <aside className="glass h-fit p-5"><h2 className="text-xl font-bold">Summary</h2>
        <ul className="mt-3 space-y-2 text-sm">{lines.map((l) => <li key={l.key} className="flex justify-between gap-2"><span>{l.qty} x {l.name} ({l.size})</span><span>{formatPKR(l.qty * l.unitPrice)}</span></li>)}</ul>
        <div className="mt-4 flex justify-between border-t border-white/10 pt-3"><span>Subtotal</span><span>{formatPKR(subtotal)}</span></div>
        {f.type === 'delivery' && fee !== null && <div className="flex justify-between"><span>Delivery</span><span>{formatPKR(fee)}</span></div>}
        <div className="mt-2 flex justify-between text-lg font-bold"><span>Total</span><span className="text-champagne">{formatPKR(subtotal + delivery)}</span></div>
        <p className="mt-2 text-xs muted">The server re-checks all prices when you place the order.</p>
      </aside>
    </section>
  )
}
