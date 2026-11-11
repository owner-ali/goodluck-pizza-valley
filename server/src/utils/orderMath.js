export class OrderError extends Error {}
export const MAX_QTY = 20

// Prices ALWAYS come from the database products, never from the browser.
export function priceOrder(products, lines, deliveryFee = 0) {
  if (!Array.isArray(lines) || lines.length === 0 || lines.length > 30) throw new OrderError('Your cart is empty or too large.')
  const byId = new Map(products.map((p) => [p.id, p]))
  const out = []
  let subtotal = 0
  for (const l of lines) {
    const p = byId.get(l.itemId)
    if (!p || p.available === false) throw new OrderError('An item in your cart is no longer available. Please remove it and try again.')
    const size = p.sizes.find((s) => s.id === l.sizeId)
    if (!size) throw new OrderError(`The size chosen for ${p.name} is not available.`)
    const qty = Number(l.qty)
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) throw new OrderError(`Quantity for ${p.name} must be 1 to ${MAX_QTY}.`)
    const addons = [...new Set(l.addonIds ?? [])].map((id) => p.addons.find((a) => a.id === id))
    if (addons.some((a) => !a)) throw new OrderError(`An add-on for ${p.name} is not available.`)
    const unitPrice = size.price + addons.reduce((t, a) => t + a.price, 0)
    out.push({ productId: p.id, name: p.name, size: size.label, addons: addons.map((a) => a.label), qty, unitPrice })
    subtotal += unitPrice * qty
  }
  return { lines: out, subtotal, deliveryFee, total: subtotal + deliveryFee }
}
