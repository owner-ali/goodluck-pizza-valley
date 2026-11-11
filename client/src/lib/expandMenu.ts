const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
export function expandMenu(raw: any) {
  const opt = (o: any) => ({ ...o, id: o.id ?? slug(o.label) })
  return {
    categories: raw.categories,
    items: raw.items.map((i: any) => ({
      available: true, ...i,
      sizes: i.sizes.map(opt),
      addons: (typeof i.addons === 'string' ? raw.addonSets[i.addons] ?? [] : i.addons ?? []).map(opt),
    })),
  }
}
