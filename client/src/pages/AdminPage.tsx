import { useEffect, useState, type FormEvent, type ReactElement } from 'react'
import { useTitle } from '../hooks/useTitle'
import { adminFetch, getToken, setToken } from '../admin/adminApi'
import { apiConfigured } from '../services/orderService'
import Field, { inputCls } from '../components/Field'
import * as P from '../admin/Panels'

const TABS: [string, string, () => ReactElement][] = [
  ['dashboard', 'Dashboard', P.DashboardPanel], ['orders', 'Orders', P.OrdersPanel], ['reservations', 'Reservations', P.ReservationsPanel],
  ['products', 'Products', P.ProductsPanel], ['categories', 'Categories', P.CategoriesPanel], ['customers', 'Customers', P.CustomersPanel],
  ['gallery', 'Gallery', P.GalleryPanel], ['reviews', 'Reviews', P.ReviewsPanel], ['messages', 'Messages', P.MessagesPanel], ['settings', 'Settings', P.SettingsPanel],
]

function Login({ onDone }: { onDone: () => void }) {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('')
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false)
  const submit = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true); setErr('')
    try { const r = await adminFetch<{ token: string }>('/login', { method: 'POST', body: { email, password } }); setToken(r.token); onDone() }
    catch (x) { setErr((x as Error).message) } finally { setBusy(false) }
  }
  return (
    <section className="mx-auto max-w-sm px-6 py-16">
      <h1 className="text-3xl font-bold">Admin sign in</h1>
      {!apiConfigured && <p role="alert" className="glass mt-4 p-3 text-sm">The server is not connected. Set <code>VITE_API_URL</code> in <code>client/.env</code>.</p>}
      <form onSubmit={submit} className="mt-6 space-y-4">
        <Field id="ae" label="Email"><input id="ae" type="email" autoComplete="username" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} required /></Field>
        <Field id="ap" label="Password"><input id="ap" type="password" autoComplete="current-password" className={inputCls} value={password} onChange={(e) => setPassword(e.target.value)} required /></Field>
        {err && <p role="alert" className="text-sm text-red-300">{err}</p>}
        <button className="btn btn-ember" disabled={busy || !apiConfigured}>{busy ? 'Signing in...' : 'Sign in'}</button>
      </form>
    </section>)
}

export default function AdminPage() {
  useTitle('Admin | Good Luck Pizza Valley & Ice Bar')
  const [authed, setAuthed] = useState(!!getToken())
  const [tab, setTab] = useState('dashboard')
  useEffect(() => {
    const m = document.createElement('meta'); m.name = 'robots'; m.content = 'noindex'; document.head.appendChild(m)
    const out = () => setAuthed(false); window.addEventListener('admin-logout', out)
    return () => { m.remove(); window.removeEventListener('admin-logout', out) }
  }, [])
  if (!authed) return <Login onDone={() => setAuthed(true)} />
  const Panel = TABS.find((t) => t[0] === tab)![2]
  return (
    <section className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex items-center justify-between"><h1 className="text-3xl font-bold">Admin</h1>
        <button className="btn btn-frost !py-2" onClick={() => { setToken(null); setAuthed(false) }}>Sign out</button></div>
      <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-2" role="group" aria-label="Admin sections">
        {TABS.map(([id, label]) => <button key={id} aria-pressed={tab === id} onClick={() => setTab(id)} className={`shrink-0 rounded-full border px-4 py-2 text-sm ${tab === id ? 'border-ember bg-ember font-bold text-black' : 'border-white/20'}`}>{label}</button>)}
      </div>
      <div className="mt-6"><Panel key={tab} /></div>
    </section>)
}
