import crypto from 'node:crypto'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import { priceOrder, OrderError } from '../utils/orderMath.js'
import { normalizePhone } from '../utils/validate.js'
import { getSettings } from '../utils/settingsStore.js'

const newId = () => 'GL-' + crypto.randomBytes(4).toString('hex').toUpperCase()

export async function createOrder(req, res, next) {
  try {
    const { customer, type, address, notes, lines } = req.body
    const ids = [...new Set(lines.map((l) => String(l.itemId)))]
    const products = await Product.find({ id: { $in: ids } }).lean()
    const { deliveryFee } = await getSettings()
    let priced
    try { priced = priceOrder(products, lines, type === 'delivery' ? deliveryFee : 0) }
    catch (e) { if (e instanceof OrderError) return res.status(400).json({ message: e.message }); throw e }
    const order = await Order.create({
      orderId: newId(), customer: { name: customer.name.trim(), phone: normalizePhone(customer.phone) },
      type, address: type === 'delivery' ? address : '', notes: notes ?? '', ...priced, payment: 'cod',
    })
    res.status(201).json({ orderId: order.orderId, total: order.total, status: order.status })
  } catch (e) { next(e) }
}

export async function trackOrder(req, res, next) {
  try {
    const o = await Order.findOne({ orderId: String(req.body.id).toUpperCase(), 'customer.phone': normalizePhone(req.body.phone) }).lean()
    if (!o) return res.status(404).json({ message: 'No order found with those details.' })
    res.json({ orderId: o.orderId, status: o.status, type: o.type, lines: o.lines, subtotal: o.subtotal, deliveryFee: o.deliveryFee, total: o.total, createdAt: o.createdAt })
  } catch (e) { next(e) }
}
