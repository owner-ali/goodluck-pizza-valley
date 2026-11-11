import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import Admin from '../models/Admin.js'
import Category from '../models/Category.js'
import Product from '../models/Product.js'
import Order, { ORDER_STATUSES } from '../models/Order.js'
import Reservation, { RES_STATUSES } from '../models/Reservation.js'
import Review from '../models/Review.js'
import Gallery from '../models/Gallery.js'
import Message from '../models/Message.js'
import Setting from '../models/Setting.js'
import { UPLOAD_DIR } from '../config/paths.js'
import { cleanProduct, cleanSettings, slug, sniffImage } from '../utils/adminClean.js'
import { getSettings } from '../utils/settingsStore.js'

const DUMMY = bcrypt.hashSync('dummy-password', 12)
const wrap = (fn) => async (req, res, next) => { try { await fn(req, res) } catch (e) { next(e) } }
const bad = (res, message, code = 400) => res.status(code).json({ message })
const notFound = (res) => bad(res, 'Not found.', 404)
const hide = '-_id -__v'

export const login = wrap(async (req, res) => {
  const email = String(req.body.email ?? '').toLowerCase().trim(), password = String(req.body.password ?? '')
  const a = await Admin.findOne({ email })
  const ok = await bcrypt.compare(password, a ? a.passwordHash : DUMMY)
  if (!a || !ok) return bad(res, 'Incorrect email or password.', 401)
  res.json({ token: jwt.sign({ sub: String(a._id), email: a.email }, process.env.JWT_SECRET, { expiresIn: '8h' }) })
})

export const stats = wrap(async (_req, res) => {
  const start = new Date(); start.setHours(0, 0, 0, 0)
  const [ordersToday, pendingOrders, rev, pendingReservations, products, pendingReviews, messages] = await Promise.all([
    Order.countDocuments({ createdAt: { $gte: start } }), Order.countDocuments({ status: 'pending' }),
    Order.aggregate([{ $match: { status: 'completed' } }, { $group: { _id: null, t: { $sum: '$total' } } }]),
    Reservation.countDocuments({ status: 'pending' }), Product.countDocuments(), Review.countDocuments({ status: 'pending' }), Message.countDocuments(),
  ])
  res.json({ ordersToday, pendingOrders, revenue: rev[0]?.t ?? 0, pendingReservations, products, pendingReviews, messages })
})

// ---- orders / reservations
export const listOrders = wrap(async (req, res) => {
  const q = ORDER_STATUSES.includes(req.query.status) ? { status: req.query.status } : {}
  res.json(await Order.find(q).sort('-createdAt').limit(200).select(hide).lean())
})
export const setOrderStatus = wrap(async (req, res) => {
  if (!ORDER_STATUSES.includes(req.body.status)) return bad(res, 'Invalid status.')
  const o = await Order.findOneAndUpdate({ orderId: String(req.params.id) }, { status: req.body.status }, { new: true })
  o ? res.json({ ok: true }) : notFound(res)
})
export const listReservations = wrap(async (_req, res) => res.json(await Reservation.find().sort('-createdAt').limit(200).select(hide).lean()))
export const setReservationStatus = wrap(async (req, res) => {
  if (!RES_STATUSES.includes(req.body.status)) return bad(res, 'Invalid status.')
  const r = await Reservation.findOneAndUpdate({ reservationId: String(req.params.id) }, { status: req.body.status }, { new: true })
  r ? res.json({ ok: true }) : notFound(res)
})
export const listCustomers = wrap(async (_req, res) => {
  res.json(await Order.aggregate([
    { $sort: { createdAt: 1 } },
    { $group: { _id: '$customer.phone', name: { $last: '$customer.name' }, orders: { $sum: 1 }, spent: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 0, '$total'] } }, last: { $last: '$createdAt' } } },
    { $sort: { last: -1 } }, { $limit: 500 }, { $project: { _id: 0, phone: '$_id', name: 1, orders: 1, spent: 1, last: 1 } },
  ]))
})

// ---- categories
export const listCategories = wrap(async (_req, res) => res.json(await Category.find().sort('order').select(hide).lean()))
export const saveCategory = wrap(async (req, res) => {
  const name = String(req.body.name ?? '').trim().slice(0, 60)
  const id = slug(req.params.id || req.body.id || name)
  if (name.length < 2 || !id) return bad(res, 'Enter a category name.')
  const world = req.body.world === 'ice' ? 'ice' : 'pizza', order = Math.max(0, Math.min(999, parseInt(req.body.order, 10) || 0))
  if (!req.params.id && (await Category.exists({ id }))) return bad(res, 'A category with this name already exists.')
  await Category.findOneAndUpdate({ id }, { id, name, world, order }, { upsert: true, runValidators: true })
  res.json({ ok: true })
})
export const deleteCategory = wrap(async (req, res) => {
  if (await Product.exists({ categoryId: String(req.params.id) })) return bad(res, 'Move or delete this category\'s products first.')
  await Category.deleteOne({ id: String(req.params.id) }); res.json({ ok: true })
})

// ---- products
export const listProducts = wrap(async (_req, res) => res.json(await Product.find().sort('categoryId name').select(hide + ' -createdAt -updatedAt').lean()))
export const createProduct = wrap(async (req, res) => {
  let data
  try { data = cleanProduct(req.body) } catch (e) { return bad(res, e.message) }
  if (!(await Category.exists({ id: data.categoryId }))) return bad(res, 'Choose a valid category.')
  let id = slug(data.name) || 'item'
  if (await Product.exists({ id })) id += '-' + crypto.randomBytes(2).toString('hex')
  await Product.create({ ...data, id }); res.status(201).json({ id })
})
export const updateProduct = wrap(async (req, res) => {
  let data
  try { data = cleanProduct(req.body) } catch (e) { return bad(res, e.message) }
  if (!(await Category.exists({ id: data.categoryId }))) return bad(res, 'Choose a valid category.')
  const p = await Product.findOneAndUpdate({ id: String(req.params.id) }, data, { new: true, runValidators: true })
  p ? res.json({ ok: true }) : notFound(res)
})
export const deleteProduct = wrap(async (req, res) => { await Product.deleteOne({ id: String(req.params.id) }); res.json({ ok: true }) })

// ---- uploads (memory -> verified by magic bytes -> random file name)
export const uploadImage = wrap(async (req, res) => {
  if (!req.file) return bad(res, 'Choose an image file (JPG, PNG or WebP, up to 2 MB).')
  const ext = sniffImage(req.file.buffer)
  if (!ext) return bad(res, 'That file is not a valid JPG, PNG or WebP image.')
  const name = crypto.randomBytes(12).toString('hex') + '.' + ext
  await fs.writeFile(path.join(UPLOAD_DIR, name), req.file.buffer)
  res.status(201).json({ url: '/uploads/' + name })
})

// ---- gallery / reviews / messages
export const listGallery = wrap(async (_req, res) => res.json(await Gallery.find().sort('-createdAt').lean()))
export const addGallery = wrap(async (req, res) => {
  if (!/^\/uploads\/[a-f0-9]+\.(jpg|png|webp)$/.test(req.body.url ?? '')) return bad(res, 'Upload an image first.')
  await Gallery.create({ url: req.body.url, caption: String(req.body.caption ?? '').trim().slice(0, 120) }); res.status(201).json({ ok: true })
})
export const deleteGallery = wrap(async (req, res) => { await Gallery.deleteOne({ _id: String(req.params.id) }); res.json({ ok: true }) })
export const listReviews = wrap(async (_req, res) => res.json(await Review.find().sort('-createdAt').limit(200).lean()))
export const approveReview = wrap(async (req, res) => { await Review.updateOne({ _id: String(req.params.id) }, { status: 'approved' }); res.json({ ok: true }) })
export const deleteReview = wrap(async (req, res) => { await Review.deleteOne({ _id: String(req.params.id) }); res.json({ ok: true }) })
export const listMessages = wrap(async (_req, res) => res.json(await Message.find().sort('-createdAt').limit(200).lean()))
export const deleteMessage = wrap(async (req, res) => { await Message.deleteOne({ _id: String(req.params.id) }); res.json({ ok: true }) })

// ---- settings
export const readSettings = wrap(async (_req, res) => res.json(await getSettings()))
export const writeSettings = wrap(async (req, res) => {
  await getSettings()
  await Setting.updateOne({ key: 'main' }, { $set: cleanSettings(req.body ?? {}) }); res.json({ ok: true })
})
