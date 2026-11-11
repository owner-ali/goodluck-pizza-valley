import { useState, type FormEvent } from 'react'
import { useTitle } from '../hooks/useTitle'
import { useSettings } from '../hooks/useSettings'
import { apiConfigured } from '../services/orderService'
import { postMessage } from '../services/publicService'
import Field, { inputCls } from '../components/Field'

export default function ContactPage() {
  useTitle('Contact us | Good Luck Pizza Valley & Ice Bar', 'Address, phone, opening hours and a contact form.')
  const { settings: s } = useSettings()
  const [f, setF] = useState({ name: '', contact: '', message: '' })
  const [msg, setMsg] = useState(''); const [ok, setOk] = useState(false); const [busy, setBusy] = useState(false)
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (f.name.trim().length < 2) return setMsg('Enter your name.')
    if (f.contact.trim().length < 5) return setMsg('Enter a phone number or email so we can reply.')
    if (f.message.trim().length < 5) return setMsg('Write at least 5 characters.')
    setBusy(true); setMsg('')
    try { await postMessage(f); setOk(true); setF({ name: '', contact: '', message: '' }) } catch (x) { setMsg((x as Error).message) } finally { setBusy(false) }
  }
  const socials = Object.entries(s.social).filter(([, v]) => v)
  return (
    <section className="mx-auto grid max-w-4xl gap-8 px-6 py-12 md:grid-cols-2">
      <div>
        <h1 className="text-4xl font-bold">Contact us</h1>
        <address className="mt-4 space-y-1 not-italic"><p>{s.contact.address}</p><p>{s.contact.phone}</p>{s.contact.email && <p>{s.contact.email}</p>}{s.contact.whatsapp && <p>WhatsApp: {s.contact.whatsapp}</p>}</address>
        {socials.length > 0 && <p className="mt-3 flex gap-4">{socials.map(([k, v]) => <a key={k} className="capitalize text-frost underline" href={v} target="_blank" rel="noopener noreferrer">{k}</a>)}</p>}
        <h2 className="mt-6 text-xl font-bold text-champagne">Opening hours</h2>
        <ul>{s.hours.map((h) => <li key={h.day} className="flex justify-between border-b border-white/10 py-1"><span>{h.day}</span><span>{h.hours}</span></li>)}</ul>
      </div>
      <form onSubmit={submit} noValidate className="glass h-fit space-y-3 p-5"><h2 className="text-xl font-bold">Send a message</h2>
        {ok ? <p role="status">Message sent. We'll get back to you.</p> : (<>
          <Field id="cn" label="Your name"><input id="cn" className={inputCls} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
          <Field id="cc" label="Phone or email"><input id="cc" className={inputCls} value={f.contact} onChange={(e) => setF({ ...f, contact: e.target.value })} /></Field>
          <Field id="cm" label="Message"><textarea id="cm" rows={4} maxLength={1000} className={inputCls} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} /></Field>
          {msg && <p role="alert" className="text-sm text-red-300">{msg}</p>}
          <button className="btn btn-frost" disabled={busy || !apiConfigured}>{busy ? 'Sending...' : 'Send message'}</button>
          {!apiConfigured && <p className="text-xs muted">The server is not connected, so messages can't be sent yet.</p>}</>)}
      </form>
    </section>)
}
