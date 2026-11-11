import { useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTitle } from '../hooks/useTitle'
import { apiConfigured, trackOrder, type TrackedOrder } from '../services/orderService'
import { isPhone } from '../lib/validate'
import { formatPKR } from '../lib/pricing'
import Field, { inputCls } from '../components/Field'
import StatusTimeline from '../components/StatusTimeline'

const STEPS = ['pending', 'confirmed', 'preparing', 'ready', 'completed']
const LABELS = (type: string): Record<string, string> => ({ pending: 'Order received', confirmed: 'Confirmed', preparing: 'Being prepared',
  ready: type === 'delivery' ? 'Out for delivery' : 'Ready for pickup', completed: 'Completed', cancelled: 'Cancelled' })

export default function TrackPage() {
  useTitle('Track your order | Good Luck Pizza Valley & Ice Bar')
  const [params] = useSearchParams()
  const [id, setId] = useState(params.get('id') ?? '')
  const [phone, setPhone] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const [order, setOrder] = useState<TrackedOrder | null>(null)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (id.trim().length < 4) return setErr('Enter your order ID, for example GL-1A2B3C4D.')
    if (!isPhone(phone)) return setErr('Enter the phone number you used for the order.')
    setBusy(true); setErr(''); setOrder(null)
    try { setOrder(await trackOrder(id.trim(), phone)) } catch (x) { setErr((x as Error).message) } finally { setBusy(false) }
  }
  return (
    <section className="mx-auto max-w-xl px-6 py-12">
      <h1 className="text-4xl font-bold">Track your order</h1>
      {!apiConfigured && <p role="alert" className="glass mt-4 p-4 text-sm">Tracking needs the server. Set <code>VITE_API_URL</code> in <code>client/.env</code>.</p>}
      <form onSubmit={submit} noValidate className="mt-6 space-y-4">
        <Field id="oid" label="Order ID"><input id="oid" className={inputCls} value={id} onChange={(e) => setId(e.target.value)} /></Field>
        <Field id="ophone" label="Phone used for the order"><input id="ophone" type="tel" className={inputCls} value={phone} onChange={(e) => setPhone(e.target.value)} /></Field>
        {err && <p role="alert" className="text-sm text-red-300">{err}</p>}
        <button className="btn btn-frost" disabled={busy}>{busy ? 'Checking...' : 'Check status'}</button>
      </form>
      {order && (
        <div className="glass mt-8 p-5" aria-live="polite">
          <h2 className="text-xl font-bold">Order {order.orderId}</h2>
          {order.status === 'cancelled' ? <p className="mt-3 text-red-300">This order was cancelled.</p>
            : <StatusTimeline steps={STEPS} labels={LABELS(order.type)} current={order.status} />}
          <ul className="mt-4 space-y-1 text-sm">{order.lines.map((l, i) => <li key={i}>{l.qty} x {l.name} ({l.size})</li>)}</ul>
          <p className="mt-3 font-bold">Total: {formatPKR(order.total)}</p>
        </div>)}
    </section>)
}
