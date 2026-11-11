export type Row = Record<string, string>
// "a | b | c" per line -> objects. The last key keeps any extra "|" characters.
export function parseLines(text: string, keys: string[]): Row[] {
  return text.split('\n').map((l) => l.trim()).filter(Boolean).map((l) => {
    const p = l.split('|').map((s) => s.trim())
    if (p.length < keys.length || p.slice(0, keys.length).some((x) => !x)) throw new Error(`Each line must look like: ${keys.join(' | ')}`)
    const vals = [...p.slice(0, keys.length - 1), p.slice(keys.length - 1).join('|')]
    return Object.fromEntries(vals.map((v, i) => [keys[i], v]))
  })
}
export const formatLines = (rows: Row[] | undefined, keys: string[]) => (rows ?? []).map((r) => keys.map((k) => r[k] ?? '').join(' | ')).join('\n')

const price = (v: string) => { const n = Number(v); if (!Number.isFinite(n) || n < 0) throw new Error('Prices must be numbers like 900'); return n }
export const parseSizes = (t: string) => parseLines(t, ['label', 'price']).map((r) => ({ label: r.label, price: price(r.price) }))
export const formatSizes = (s?: { label: string; price: number }[]) => formatLines(s?.map((x) => ({ label: x.label, price: String(x.price) })), ['label', 'price'])
export const parseAddons = (t: string) => parseLines(t, ['group', 'label', 'price']).map((r) => ({ group: r.group, label: r.label, price: price(r.price) }))
export const formatAddons = (a?: { group?: string; label: string; price: number }[]) => formatLines(a?.map((x) => ({ group: x.group ?? 'Add-ons', label: x.label, price: String(x.price) })), ['group', 'label', 'price'])
