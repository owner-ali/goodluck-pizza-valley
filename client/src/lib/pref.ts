// Remembers delivery/pickup and the area chosen in the top bar (browser only, used to pre-fill checkout).
export interface Pref { mode: 'delivery' | 'pickup'; area: string }
const KEY = 'glpv_pref_v1'
export function getPref(): Pref {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || '{}')
    return { mode: v.mode === 'pickup' ? 'pickup' : 'delivery', area: typeof v.area === 'string' ? v.area.slice(0, 120) : '' }
  } catch { return { mode: 'delivery', area: '' } }
}
export function setPref(p: Pref) { try { localStorage.setItem(KEY, JSON.stringify(p)) } catch { /* storage blocked */ } }
