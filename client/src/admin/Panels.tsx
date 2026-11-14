import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { adminFetch } from './adminApi'
import { inputCls } from '../components/Field'
import { formatPKR } from '../lib/pricing'
import { assetUrl } from '../services/api'
import { formatAddons, formatLines, formatSizes, parseAddons, parseLines, parseSizes } from '../lib/adminParse'

type R = Record<string, any>
function useList(path: string) {
  const [data, setData] = useState<any>(null)
  const [err, setErr] = useState('')
  const reload = useCallback(() => { adminFetch<any>(path).then((d) => { setData(d); setErr('') }).catch((e: Error) => setErr(e.message)) }, [path])
  useEffect(() => { reload() }, [reload])
  return { data, err, reload, setErr }
}
async function run(p: Promise<unknown>, reload: () => void, setErr: (s: string) => void) { try { await p; reload() } catch (e) { setErr((e as Error).message) } }
const Err = ({ err }: { err: string }) => (err ? <p role="alert" className="mb-3 text-sm text-red-300">{err}</p> : null)
const Empty = ({ data, text }: { data: any; text: string }) => (Array.isArray(data) && data.length === 0 ? <p className="muted">{text}</p> : null)
const small = 'rounded-lg border border-white/20 px-3 py-1 text-sm'
const date = (d: string) => new Date(d).toLocaleString()

export function DashboardPanel() {
  const { data, err } = useList('/stats')
  const items: [string, string | number][] = data ? [['Orders today', data.ordersToday], ['Pending orders', data.pendingOrders], ['Revenue (completed orders)', formatPKR(data.revenue)],
    ['Pending reservations', data.pendingReservations], ['Products', data.products], ['Reviews to approve', data.pendingReviews], ['Messages', data.messages]] : []
  return (<><Err err={err} /><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{items.map(([k, v]) => <div key={k} className="glass p-4"><p className="text-sm muted">{k}</p><p className="text-2xl font-bold text-champagne">{v}</p></div>)}</div></>)
}

const ORDER_ST = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled']
export function OrdersPanel() {
  const [st, setSt] = useState('')
  const { data, err, reload, setErr } = useList('/orders' + (st ? `?status=${st}` : ''))
  return (<>
    <Err err={err} />
    <label className="mb-4 block text-sm">Filter <select className={`${inputCls} !w-auto`} value={st} onChange={(e) => setSt(e.target.value)}><option value="">All</option>{ORDER_ST.map((s) => <option key={s}>{s}</option>)}</select></label>
    <Empty data={data} text="No orders yet." />
    {data?.map((o: R) => (
      <article key={o.orderId} className="glass mb-3 p-4">
        <div className="flex flex-wrap justify-between gap-2"><b>{o.orderId}</b><span>{formatPKR(o.total)}</span></div>
        <p className="text-sm">{o.customer.name} | {o.customer.phone} | {o.type} | {date(o.createdAt)}</p>
        {o.type === 'delivery' && <p className="text-sm muted">{o.address}</p>}
        <ul className="mt-2 text-sm">{o.lines.map((l: R, i: number) => <li key={i}>{l.qty} x {l.name} ({l.size}){l.addons?.length ? ` + ${l.addons.join(', ')}` : ''}</li>)}</ul>
        {o.notes && <p className="mt-1 text-sm">Note: {o.notes}</p>}
        <label className="mt-2 block text-sm">Status <select className={`${inputCls} !w-auto`} value={o.status} onChange={(e) => run(adminFetch(`/orders/${o.orderId}`, { method: 'PATCH', body: { status: e.target.value } }), reload, setErr)}>{ORDER_ST.map((s) => <option key={s}>{s}</option>)}</select></label>
      </article>))}</>)
}

export function ReservationsPanel() {
  const { data, err, reload, setErr } = useList('/reservations')
  const set = (id: string, status: string) => run(adminFetch(`/reservations/${id}`, { method: 'PATCH', body: { status } }), reload, setErr)
  return (<><Err err={err} /><Empty data={data} text="No reservations yet." />
    {data?.map((r: R) => (
      <article key={r.reservationId} className="glass mb-3 p-4">
        <div className="flex flex-wrap justify-between gap-2"><b>{r.reservationId}</b><span className="capitalize">{r.status}</span></div>
        <p className="text-sm">{r.name} | {r.phone}</p><p className="text-sm">{r.date} at {r.time} | {r.guests} guests</p>{r.notes && <p className="text-sm muted">{r.notes}</p>}
        <div className="mt-2 flex gap-2">{['approved', 'rejected', 'cancelled'].map((s) => <button key={s} disabled={r.status === s} className={small} onClick={() => set(r.reservationId, s)}>{s}</button>)}</div>
      </article>))}</>)
}

export function CustomersPanel() {
  const { data, err } = useList('/customers')
  return (<><Err err={err} /><Empty data={data} text="No customers yet. They appear after the first order." />
    <ul className="space-y-2">{data?.map((c: R) => <li key={c.phone} className="glass flex flex-wrap justify-between gap-2 p-3 text-sm"><span><b>{c.name}</b> | {c.phone}</span><span>{c.orders} orders | {formatPKR(c.spent)} | last {date(c.last)}</span></li>)}</ul></>)
}

const blank: R = { id: '', name: '', categoryId: '', description: '', emoji: '🍽️', color: '', image: '', veg: false, spicy: false, popular: false, available: true, sizes: '', addons: '', compareAt: '' }
export function ProductsPanel() {
  const p = useList('/products'); const c = useList('/categories')
  const [f, setF] = useState<R>(blank); const [msg, setMsg] = useState('')
  const set = (x: R) => setF((s) => ({ ...s, ...x }))
  const edit = (i: R) => { setMsg(''); setF({ ...blank, ...i, color: i.color ?? '', image: i.image ?? '', sizes: formatSizes(i.sizes), addons: formatAddons(i.addons), compareAt: i.compareAt ?? '' }); window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }) }
  const save = async (e: FormEvent) => {
    e.preventDefault(); setMsg('')
    try {
      const body = { ...f, sizes: parseSizes(f.sizes), addons: parseAddons(f.addons) }
      if (f.id) await adminFetch(`/products/${f.id}`, { method: 'PUT', body }); else await adminFetch('/products', { method: 'POST', body })
      setF(blank); p.reload(); setMsg('Saved.')
    } catch (x) { setMsg((x as Error).message) }
  }
  const upload = async (file?: File) => {
    if (!file) return
    const form = new FormData(); form.append('image', file)
    try { const r = await adminFetch<{ url: string }>('/upload', { method: 'POST', form }); set({ image: r.url }) } catch (x) { setMsg((x as Error).message) }
  }
  return (<>
    <Err err={p.err} /><Empty data={p.data} text="No products yet. Add one below, or run npm run seed." />
    <ul className="space-y-2">{p.data?.map((i: R) => (
      <li key={i.id} className="glass flex flex-wrap items-center justify-between gap-2 p-3">
        <span>{i.emoji} <b>{i.name}</b> <span className="text-sm muted">({i.categoryId}) from {formatPKR(Math.min(...i.sizes.map((s: R) => s.price)))}{i.available ? '' : ' | hidden'}</span></span>
        <span className="flex gap-2"><button className={small} onClick={() => edit(i)}>Edit</button>
          <button className={`${small} text-red-300`} onClick={() => { if (confirm(`Delete ${i.name}?`)) run(adminFetch(`/products/${i.id}`, { method: 'DELETE' }), p.reload, p.setErr) }}>Delete</button></span>
      </li>))}</ul>
    <form onSubmit={save} className="glass mt-6 space-y-3 p-4"><h3 className="text-xl font-bold">{f.id ? `Edit ${f.name}` : 'Add a product'}</h3>
      <label className="block text-sm">Name<input className={inputCls} value={f.name} onChange={(e) => set({ name: e.target.value })} required /></label>
      <label className="block text-sm">Category<select className={inputCls} value={f.categoryId} onChange={(e) => set({ categoryId: e.target.value })} required><option value="">Choose...</option>{c.data?.map((x: R) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
      <label className="block text-sm">Description<textarea rows={2} maxLength={400} className={inputCls} value={f.description} onChange={(e) => set({ description: e.target.value })} /></label>
      <div className="grid grid-cols-2 gap-3"><label className="block text-sm">Emoji<input className={inputCls} value={f.emoji} onChange={(e) => set({ emoji: e.target.value })} /></label>
        <label className="block text-sm">Drink colour (#rrggbb, optional)<input className={inputCls} value={f.color} onChange={(e) => set({ color: e.target.value })} /></label></div>
      <label className="block text-sm">Original price in PKR (optional, shows a "Save %" badge when higher than the size price)<input type="number" min={0} className={inputCls} value={f.compareAt} onChange={(e) => set({ compareAt: e.target.value })} /></label>
      <label className="block text-sm">Photo (JPG, PNG or WebP, max 2 MB)<input type="file" accept="image/jpeg,image/png,image/webp" className={inputCls} onChange={(e) => upload(e.target.files?.[0])} /></label>
      {f.image && <p className="flex items-center gap-3 text-sm"><img src={assetUrl(f.image)} alt="" className="h-14 w-14 rounded-lg object-cover" /><button type="button" className={small} onClick={() => set({ image: '' })}>Remove photo</button></p>}
      <label className="block text-sm">Sizes and prices in PKR, one per line: Name | Price<textarea rows={3} className={inputCls} value={f.sizes} onChange={(e) => set({ sizes: e.target.value })} placeholder={'Small | 900\nLarge | 2000'} /></label>
      <label className="block text-sm">Toppings and add-ons, one per line: Group | Name | Price<textarea rows={3} className={inputCls} value={f.addons} onChange={(e) => set({ addons: e.target.value })} placeholder="Toppings | Olives | 80" /></label>
      <div className="flex flex-wrap gap-4 text-sm">{(['veg', 'spicy', 'popular', 'available'] as const).map((k) => <label key={k}><input type="checkbox" className="mr-1" checked={!!f[k]} onChange={(e) => set({ [k]: e.target.checked })} />{k}</label>)}</div>
      {msg && <p role="status" className="text-sm">{msg}</p>}
      <div className="flex gap-2"><button className="btn btn-ember">Save product</button>{f.id && <button type="button" className="btn btn-frost" onClick={() => setF(blank)}>Cancel edit</button>}</div>
    </form></>)
}

export function CategoriesPanel() {
  const { data, err, reload, setErr } = useList('/categories')
  const [f, setF] = useState<R>({ id: '', name: '', world: 'pizza', order: 0 }); const [msg, setMsg] = useState('')
  const save = async (e: FormEvent) => {
    e.preventDefault(); setMsg('')
    try { await adminFetch(f.id ? `/categories/${f.id}` : '/categories', { method: f.id ? 'PUT' : 'POST', body: f }); setF({ id: '', name: '', world: 'pizza', order: 0 }); reload() } catch (x) { setMsg((x as Error).message) }
  }
  return (<><Err err={err} /><Empty data={data} text="No categories yet. Add one below, or run npm run seed." />
    <ul className="space-y-2">{data?.map((c: R) => <li key={c.id} className="glass flex items-center justify-between gap-2 p-3"><span><b>{c.name}</b> <span className="text-sm muted">({c.world}, order {c.order})</span></span>
      <span className="flex gap-2"><button className={small} onClick={() => setF(c)}>Edit</button><button className={`${small} text-red-300`} onClick={() => { if (confirm(`Delete ${c.name}?`)) run(adminFetch(`/categories/${c.id}`, { method: 'DELETE' }), reload, setErr) }}>Delete</button></span></li>)}</ul>
    <form onSubmit={save} className="glass mt-6 space-y-3 p-4"><h3 className="text-xl font-bold">{f.id ? 'Edit category' : 'Add a category'}</h3>
      <label className="block text-sm">Name<input className={inputCls} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required /></label>
      <div className="grid grid-cols-2 gap-3"><label className="block text-sm">Section<select className={inputCls} value={f.world} onChange={(e) => setF({ ...f, world: e.target.value })}><option value="pizza">Pizza Valley</option><option value="ice">Ice Bar</option></select></label>
        <label className="block text-sm">Order<input type="number" min={0} max={999} className={inputCls} value={f.order} onChange={(e) => setF({ ...f, order: Number(e.target.value) })} /></label></div>
      {msg && <p role="alert" className="text-sm text-red-300">{msg}</p>}<button className="btn btn-ember">Save category</button></form></>)
}

export function ReviewsPanel() {
  const { data, err, reload, setErr } = useList('/reviews')
  return (<><Err err={err} /><Empty data={data} text="No reviews yet." />
    {data?.map((r: R) => <article key={r._id} className="glass mb-3 p-4"><p><b>{r.name}</b> | {r.rating}/5 | <span className="capitalize">{r.status}</span></p><p className="mt-1">{r.text}</p>
      <div className="mt-2 flex gap-2">{r.status !== 'approved' && <button className={small} onClick={() => run(adminFetch(`/reviews/${r._id}/approve`, { method: 'PATCH' }), reload, setErr)}>Approve</button>}
        <button className={`${small} text-red-300`} onClick={() => run(adminFetch(`/reviews/${r._id}`, { method: 'DELETE' }), reload, setErr)}>Delete</button></div></article>)}</>)
}

export function MessagesPanel() {
  const { data, err, reload, setErr } = useList('/messages')
  return (<><Err err={err} /><Empty data={data} text="No messages yet." />
    {data?.map((m: R) => <article key={m._id} className="glass mb-3 p-4"><p><b>{m.name}</b> | {m.contact} | <span className="text-sm muted">{date(m.createdAt)}</span></p><p className="mt-1 whitespace-pre-line">{m.message}</p>
      <button className={`${small} mt-2 text-red-300`} onClick={() => run(adminFetch(`/messages/${m._id}`, { method: 'DELETE' }), reload, setErr)}>Delete</button></article>)}</>)
}

export function GalleryPanel() {
  const { data, err, reload, setErr } = useList('/gallery')
  const [caption, setCaption] = useState(''); const [msg, setMsg] = useState('')
  const add = async (file?: File) => {
    if (!file) return
    setMsg('')
    try { const form = new FormData(); form.append('image', file); const u = await adminFetch<{ url: string }>('/upload', { method: 'POST', form }); await adminFetch('/gallery', { method: 'POST', body: { url: u.url, caption } }); setCaption(''); reload() } catch (x) { setMsg((x as Error).message) }
  }
  return (<><Err err={err} />
    <div className="glass mb-6 space-y-3 p-4"><h3 className="text-xl font-bold">Add a photo</h3>
      <label className="block text-sm">Caption (optional)<input className={inputCls} maxLength={120} value={caption} onChange={(e) => setCaption(e.target.value)} /></label>
      <label className="block text-sm">Photo (JPG, PNG or WebP, max 2 MB)<input type="file" accept="image/jpeg,image/png,image/webp" className={inputCls} onChange={(e) => { add(e.target.files?.[0]); e.target.value = '' }} /></label>
      {msg && <p role="alert" className="text-sm text-red-300">{msg}</p>}</div>
    <Empty data={data} text="No photos yet." />
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{data?.map((g: R) => <figure key={g._id} className="glass p-2"><img src={assetUrl(g.url)} alt={g.caption || ''} className="aspect-square w-full rounded-lg object-cover" /><figcaption className="mt-1 text-xs muted">{g.caption}</figcaption>
      <button className={`${small} mt-1 text-red-300`} onClick={() => run(adminFetch(`/gallery/${g._id}`, { method: 'DELETE' }), reload, setErr)}>Delete</button></figure>)}</div></>)
}

export function SettingsPanel() {
  const { data, err } = useList('/settings')
  const [f, setF] = useState<R | null>(null); const [msg, setMsg] = useState('')
  useEffect(() => {
    if (data) setF({ ...data, hoursT: formatLines(data.hours, ['day', 'hours']), faqsT: formatLines(data.faqs, ['q', 'a']), dealsT: formatLines(data.deals, ['title', 'description']) })
  }, [data])
  if (!f) return <Err err={err} />
  const set = (x: R) => setF((s) => ({ ...s!, ...x }))
  const sub = (k: 'contact' | 'social', key: string, v: string) => set({ [k]: { ...f[k], [key]: v } })
  const save = async (e: FormEvent) => {
    e.preventDefault(); setMsg('')
    try {
      await adminFetch('/settings', { method: 'PUT', body: { contact: f.contact, social: f.social, about: f.about, deliveryFee: f.deliveryFee,
        hours: parseLines(f.hoursT, ['day', 'hours']), faqs: parseLines(f.faqsT, ['q', 'a']), deals: parseLines(f.dealsT, ['title', 'description']) } })
      setMsg('Saved.')
    } catch (x) { setMsg((x as Error).message) }
  }
  const text = (k: 'contact' | 'social', key: string, label: string) => <label key={key} className="block text-sm">{label}<input className={inputCls} value={f[k][key] ?? ''} onChange={(e) => sub(k, key, e.target.value)} /></label>
  return (
    <form onSubmit={save} className="glass space-y-4 p-4">
      <h3 className="text-xl font-bold">Contact details</h3>
      {text('contact', 'address', 'Address')}{text('contact', 'phone', 'Phone')}{text('contact', 'email', 'Email')}{text('contact', 'whatsapp', 'WhatsApp number')}
      <h3 className="text-xl font-bold">Social links (full https:// links)</h3>
      {text('social', 'facebook', 'Facebook')}{text('social', 'instagram', 'Instagram')}{text('social', 'tiktok', 'TikTok')}
      <label className="block text-sm">Opening hours, one per line: Day | Hours<textarea rows={7} className={inputCls} value={f.hoursT} onChange={(e) => set({ hoursT: e.target.value })} /></label>
      <label className="block text-sm">Delivery fee (PKR)<input type="number" min={0} max={10000} className={inputCls} value={f.deliveryFee} onChange={(e) => set({ deliveryFee: Number(e.target.value) })} /></label>
      <label className="block text-sm">About text<textarea rows={5} maxLength={2000} className={inputCls} value={f.about} onChange={(e) => set({ about: e.target.value })} /></label>
      <label className="block text-sm">Special deals, one per line: Title | Description<textarea rows={4} className={inputCls} value={f.dealsT} onChange={(e) => set({ dealsT: e.target.value })} /></label>
      <label className="block text-sm">FAQ, one per line: Question | Answer<textarea rows={5} className={inputCls} value={f.faqsT} onChange={(e) => set({ faqsT: e.target.value })} /></label>
      {msg && <p role="status" className="text-sm">{msg}</p>}<button className="btn btn-ember">Save settings</button>
    </form>)
}
