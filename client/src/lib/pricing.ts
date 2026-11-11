import type { MenuItem } from '../data/types'
export const formatPKR = (n: number) => `Rs ${n.toLocaleString('en-PK')}`
export const minPrice = (i: MenuItem) => Math.min(...i.sizes.map((s) => s.price))
export const clampQty = (q: number) => Math.min(20, Math.max(1, Math.floor(q) || 1))

export function lineTotal(i: MenuItem, sizeId: string, addonIds: string[], qty: number) {
  const size = i.sizes.find((s) => s.id === sizeId)
  if (!size) throw new Error('Unknown size')
  const extra = i.addons.filter((a) => addonIds.includes(a.id)).reduce((t, a) => t + a.price, 0)
  return (size.price + extra) * clampQty(qty)
}

export type Sort = 'popular' | 'price-asc' | 'price-desc' | 'name'
export interface Filters { categoryId: string; query: string; vegOnly: boolean; maxPrice: number | null; sort: Sort }

export function applyFilters(items: MenuItem[], f: Filters): MenuItem[] {
  const q = f.query.trim().toLowerCase()
  const out = items.filter((i) =>
    (f.categoryId === 'all' || i.categoryId === f.categoryId) &&
    (!f.vegOnly || i.veg) &&
    (f.maxPrice === null || minPrice(i) <= f.maxPrice) &&
    (!q || `${i.name} ${i.description}`.toLowerCase().includes(q)))
  const by: Record<Sort, (a: MenuItem, b: MenuItem) => number> = {
    popular: (a, b) => Number(!!b.popular) - Number(!!a.popular) || a.name.localeCompare(b.name),
    'price-asc': (a, b) => minPrice(a) - minPrice(b),
    'price-desc': (a, b) => minPrice(b) - minPrice(a),
    name: (a, b) => a.name.localeCompare(b.name),
  }
  return [...out].sort(by[f.sort])
}
