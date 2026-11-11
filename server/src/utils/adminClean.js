// Pure helpers: sanitize admin input before it touches the database.
export const slug = (s) => String(s ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40)
const str = (v, max) => String(v ?? '').trim().slice(0, max)
const num = (v, min, max) => { const n = Number(v); return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : min }
const url = (v) => (/^https?:\/\//i.test(String(v ?? '').trim()) ? str(v, 200) : '')

export function cleanOptions(list, withGroup) {
  const seen = new Set()
  return (Array.isArray(list) ? list : []).slice(0, 30).map((o) => {
    const label = str(o?.label, 40), id = slug(label)
    if (!label || !id) throw new Error('Every size and add-on needs a name.')
    if (seen.has(id)) throw new Error(`Duplicate name: ${label}`)
    seen.add(id)
    const out = { id, label, price: Math.round(num(o?.price, 0, 1_000_000)) }
    if (withGroup && o?.group) out.group = str(o.group, 30)
    return out
  })
}

export function cleanProduct(b) {
  const sizes = cleanOptions(b.sizes, false)
  if (!sizes.length) throw new Error('Add at least one size with a price.')
  const name = str(b.name, 120)
  if (name.length < 2) throw new Error('Enter a product name.')
  return {
    categoryId: str(b.categoryId, 40), name, description: str(b.description, 400), emoji: str(b.emoji, 8) || '🍽️',
    color: /^#[0-9a-fA-F]{6}$/.test(b.color ?? '') ? b.color : undefined,
    image: /^\/uploads\/[a-f0-9]+\.(jpg|png|webp)$/.test(b.image ?? '') ? b.image : '',
    veg: !!b.veg, spicy: !!b.spicy, popular: !!b.popular, available: b.available !== false, sizes, addons: cleanOptions(b.addons, true),
  }
}

const rows = (arr, keys, max) => (Array.isArray(arr) ? arr : []).slice(0, max)
  .map((r) => Object.fromEntries(keys.map((k) => [k, str(r?.[k], 600)]))).filter((r) => keys.every((k) => r[k]))

export function cleanSettings(b) {
  const c = b.contact ?? {}, s = b.social ?? {}
  return {
    contact: { address: str(c.address, 200), phone: str(c.phone, 30), email: str(c.email, 100), whatsapp: str(c.whatsapp, 30) },
    social: { facebook: url(s.facebook), instagram: url(s.instagram), tiktok: url(s.tiktok) },
    hours: rows(b.hours, ['day', 'hours'], 7), about: str(b.about, 2000),
    faqs: rows(b.faqs, ['q', 'a'], 30), deals: rows(b.deals, ['title', 'description'], 20),
    deliveryFee: Math.round(num(b.deliveryFee, 0, 10000)),
  }
}

// Detects the REAL image type from the file's first bytes (the declared mimetype can be faked).
export function sniffImage(b) {
  if (!b || b.length < 12) return null
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'jpg'
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'png'
  if (b.subarray(0, 4).toString('latin1') === 'RIFF' && b.subarray(8, 12).toString('latin1') === 'WEBP') return 'webp'
  return null
}
