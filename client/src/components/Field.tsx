import type { ReactNode } from 'react'
export const inputCls = 'w-full rounded-xl border border-white/15 bg-white/5 px-3 py-3'
export default function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-bold">{label}</label>
      {children}
      {hint && !error && <p className="mt-1 text-xs muted">{hint}</p>}
      {error && <p id={`${id}-err`} role="alert" className="mt-1 text-sm text-red-300">{error}</p>}
    </div>
  )
}
