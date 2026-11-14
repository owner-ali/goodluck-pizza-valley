import { useState } from 'react'
import { Bike, Phone, Store } from 'lucide-react'
import { getPref, setPref, type Pref } from '../lib/pref'
import { useSettings } from '../hooks/useSettings'

// Delivery / pickup switch, delivery area and phone, like a food-delivery storefront.
export default function StoreBar() {
  const [p, setP] = useState<Pref>(getPref)
  const { settings } = useSettings()
  const upd = (x: Partial<Pref>) => { const n = { ...p, ...x }; setP(n); setPref(n) }
  const phone = settings.contact.phone
  const showPhone = !!phone && !phone.startsWith('[')
  return (
    <div className="border-b border-white/10 bg-white/[.03]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-6 py-3 text-sm">
        <div role="group" aria-label="Order type" className="flex rounded-full border border-white/15 p-0.5">
          {(['delivery', 'pickup'] as const).map((m) => (
            <button key={m} aria-pressed={p.mode === m} onClick={() => upd({ mode: m })}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 capitalize ${p.mode === m ? 'bg-ember font-bold text-black' : 'muted'}`}>
              {m === 'delivery' ? <Bike size={15} /> : <Store size={15} />}{m}
            </button>))}
        </div>
        {p.mode === 'delivery' && (
          <label className="flex min-w-[200px] flex-1 items-center">
            <span className="sr-only">Delivery area or address</span>
            <input value={p.area} onChange={(e) => upd({ area: e.target.value })} maxLength={120} placeholder="Delivering to: your area or address"
              className="w-full rounded-full border border-white/15 bg-white/5 px-4 py-2" />
          </label>)}
        {showPhone && <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="ml-auto flex items-center gap-1.5 font-bold text-champagne"><Phone size={15} />{phone}</a>}
      </div>
    </div>
  )
}
