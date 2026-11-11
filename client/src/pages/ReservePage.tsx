import { useState, type FormEvent } from 'react'
import { useTitle } from '../hooks/useTitle'
import { apiConfigured, createReservation, trackReservation } from '../services/orderService'
import { isPhone } from '../lib/validate'
import Field, { inputCls } from '../components/Field'

const today = () => new Date().toLocaleDateString('en-CA')
const STATUS: Record<string, string> = { pending: 'Waiting for approval', approved: 'Approved. See you soon!', rejected: 'Not available. Please try another time.', cancelled: 'Cancelled' }

export default function ReservePage() {
  useTitle('Reserve a table | Good Luck Pizza Valley & Ice Bar', 'Book a table. The restaurant approves each reservation.')
  const [f, setF] = useState({ name: '', phone: '', date: '', time: '', guests: 2, notes: '' })
  const [err, setErr] = useState<Record<string, string>>({})
  const [fail, setFail] = useState('')
  const [busy, setBusy] = useState(false)
  const [made, setMade] = useState<string | null>(null)
  const [tid, setTid] = useState(''); const [tphone, setTphone] = useState('')
  const [tres, setTres] = useState(''); const [tbusy, setTbusy] = useState(false)
  const set = (p: Partial<typeof f>) => setF((s) => ({ ...s, ...p }))

  const submit = async (ev: FormEvent) => {
    ev.preventDefault()
    const e: Record<string, string> = {}
    if (f.name.trim().length < 2) e.name = 'Enter your full name.'
    if (!isPhone(f.phone)) e.phone = 'Enter a valid phone number.'
    if (!f.date || f.date < today()) e.date = 'Choose today or a later date.'
    if (!f.time) e.time = 'Choose a time.'
    if (!(f.guests >= 1 && f.guests <= 20)) e.guests = 'Guests must be between 1 and 20.'
    setErr(e)
    if (Object.keys(e).length) return
    setBusy(true); setFail('')
    try { const r = await createReservation(f); setMade(r.reservationId) } catch (x) { setFail((x as Error).message) } finally { setBusy(false) }
  }
  const check = async (ev: FormEvent) => {
    ev.preventDefault(); setTbusy(true); setTres('')
    try { const r = await trackReservation(tid.trim(), tphone); setTres(`${r.reservationId}: ${STATUS[r.status] ?? r.status} (${r.date} at ${r.time}, ${r.guests} guests)`) }
    catch (x) { setTres((x as Error).message) } finally { setTbusy(false) }
  }

  return (
    <section className="mx-auto max-w-xl px-6 py-12">
      <h1 className="text-4xl font-bold">Reserve a table</h1>
      <p className="mt-2 text-sm muted">Every request is reviewed by the restaurant before it is confirmed.</p>
      {!apiConfigured && <p role="alert" className="glass mt-4 p-4 text-sm">Reservations need the server. Set <code>VITE_API_URL</code> in <code>client/.env</code>.</p>}
      {made ? (
        <div className="glass mt-6 p-5" role="status"><h2 className="text-xl font-bold">Request sent</h2>
          <p className="mt-2">Your reservation ID is <b className="text-champagne">{made}</b>. Status: waiting for approval. Use it below to check later.</p></div>
      ) : (
        <form onSubmit={submit} noValidate className="mt-6 space-y-4">
          <Field id="rname" label="Full name" error={err.name}><input id="rname" className={inputCls} autoComplete="name" value={f.name} onChange={(e) => set({ name: e.target.value })} /></Field>
          <Field id="rphone" label="Phone" error={err.phone}><input id="rphone" type="tel" className={inputCls} autoComplete="tel" value={f.phone} onChange={(e) => set({ phone: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field id="rdate" label="Date" error={err.date}><input id="rdate" type="date" min={today()} className={inputCls} value={f.date} onChange={(e) => set({ date: e.target.value })} /></Field>
            <Field id="rtime" label="Time" error={err.time}><input id="rtime" type="time" className={inputCls} value={f.time} onChange={(e) => set({ time: e.target.value })} /></Field>
          </div>
          <Field id="rguests" label="Guests" error={err.guests}><input id="rguests" type="number" min={1} max={20} className={inputCls} value={f.guests} onChange={(e) => set({ guests: Number(e.target.value) })} /></Field>
          <Field id="rnotes" label="Special instructions (optional)"><textarea id="rnotes" rows={2} maxLength={300} className={inputCls} value={f.notes} onChange={(e) => set({ notes: e.target.value })} /></Field>
          {fail && <p role="alert" className="rounded-xl border border-red-400/50 bg-red-500/10 p-3 text-sm">{fail}</p>}
          <button className="btn btn-ember" disabled={busy || !apiConfigured}>{busy ? 'Sending...' : 'Request reservation'}</button>
        </form>)}
      <form onSubmit={check} className="glass mt-10 space-y-3 p-5"><h2 className="text-xl font-bold">Check a reservation</h2>
        <Field id="tid" label="Reservation ID"><input id="tid" className={inputCls} value={tid} onChange={(e) => setTid(e.target.value)} /></Field>
        <Field id="tph" label="Phone"><input id="tph" type="tel" className={inputCls} value={tphone} onChange={(e) => setTphone(e.target.value)} /></Field>
        <button className="btn btn-frost" disabled={tbusy || !isPhone(tphone) || tid.trim().length < 4}>{tbusy ? 'Checking...' : 'Check status'}</button>
        {tres && <p role="status" className="text-sm">{tres}</p>}
      </form>
    </section>)
}
