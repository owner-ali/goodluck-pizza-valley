import { useEffect, useState, type FormEvent } from 'react'
import { Star } from 'lucide-react'
import { useTitle } from '../hooks/useTitle'
import { apiConfigured } from '../services/orderService'
import { getReviews, postReview } from '../services/publicService'
import Field, { inputCls } from '../components/Field'

export default function ReviewsPage() {
  useTitle('Customer reviews | Good Luck Pizza Valley & Ice Bar')
  const [list, setList] = useState<{ name: string; rating: number; text: string }[] | null>(null)
  const [f, setF] = useState({ name: '', rating: 5, text: '' })
  const [msg, setMsg] = useState(''); const [ok, setOk] = useState(false); const [busy, setBusy] = useState(false)
  useEffect(() => { if (apiConfigured) getReviews().then(setList).catch((e: Error) => setMsg(e.message)) }, [])
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (f.name.trim().length < 2) return setMsg('Enter your name.')
    if (f.text.trim().length < 5) return setMsg('Write at least 5 characters.')
    setBusy(true); setMsg('')
    try { await postReview(f); setOk(true); setF({ name: '', rating: 5, text: '' }) } catch (x) { setMsg((x as Error).message) } finally { setBusy(false) }
  }
  return (
    <section className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-4xl font-bold md:text-5xl">Customer reviews</h1>
      {!apiConfigured && <p className="glass mt-4 p-4 text-sm">Reviews need the server connected.</p>}
      {list && list.length === 0 && <p className="mt-6 muted">No reviews yet. Be the first!</p>}
      <ul className="mt-6 space-y-3">{list?.map((r, i) => (
        <li key={i} className="glass p-4"><p aria-label={`${r.rating} out of 5 stars`} className="flex gap-0.5 text-champagne">{Array.from({ length: r.rating }, (_, k) => <Star key={k} size={16} fill="currentColor" />)}</p>
          <p className="mt-2">{r.text}</p><p className="mt-1 text-sm muted">{r.name}</p></li>))}</ul>
      <form onSubmit={submit} noValidate className="glass mt-10 space-y-3 p-5"><h2 className="text-xl font-bold">Write a review</h2>
        {ok ? <p role="status">Thank you! Your review will appear after the restaurant approves it.</p> : (<>
          <Field id="rvn" label="Your name"><input id="rvn" className={inputCls} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
          <Field id="rvr" label="Rating"><select id="rvr" className={inputCls} value={f.rating} onChange={(e) => setF({ ...f, rating: Number(e.target.value) })}>{[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>)}</select></Field>
          <Field id="rvt" label="Your review"><textarea id="rvt" rows={3} maxLength={500} className={inputCls} value={f.text} onChange={(e) => setF({ ...f, text: e.target.value })} /></Field>
          {msg && <p role="alert" className="text-sm text-red-300">{msg}</p>}
          <button className="btn btn-ember" disabled={busy || !apiConfigured}>{busy ? 'Sending...' : 'Submit review'}</button></>)}
      </form>
    </section>)
}
