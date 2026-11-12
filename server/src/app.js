import './config/env.js'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import mongoose from 'mongoose'
import { connectDB } from './config/db.js'
import { normalizeUrl } from './utils/netlifyPath.js'
import { getSettings } from './utils/settingsStore.js'
import Upload from './models/Upload.js'
import menuRoutes from './routes/menu.js'
import orderRoutes from './routes/orders.js'
import reservationRoutes from './routes/reservations.js'
import adminRoutes from './routes/admin.js'
import publicRoutes from './routes/public.js'

const app = express()
app.disable('x-powered-by')
app.set('trust proxy', 1)
app.use((req, _res, next) => { req.url = normalizeUrl(req.url); next() })
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(cors({ origin: process.env.CLIENT_ORIGIN || false }))
app.use(express.json({ limit: '100kb' }))
app.use(async (_req, _res, next) => { try { await connectDB(); next() } catch (e) { next(e) } })
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 600 }))

app.get('/uploads/:file', async (req, res, next) => {
  try {
    if (!/^[a-f0-9]+\.(jpg|png|webp)$/.test(req.params.file)) return res.status(404).end()
    const u = await Upload.findOne({ name: req.params.file })
    if (!u) return res.status(404).end()
    res.set({ 'Content-Type': u.mime, 'Cache-Control': 'public, max-age=604800, immutable', 'X-Content-Type-Options': 'nosniff' })
    res.send(Buffer.from(u.data))
  } catch (e) { next(e) }
})

app.use('/api/admin', adminRoutes)
app.use('/api/menu', menuRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/reservations', reservationRoutes)
app.use('/api', publicRoutes)
app.get('/api/config', async (_q, r, n) => { try { r.json({ deliveryFee: (await getSettings()).deliveryFee }) } catch (e) { n(e) } })
app.get('/api/health', (_req, res) => res.json({ ok: true, db: mongoose.connection.readyState === 1 }))
app.use('/api', (_req, res) => res.status(404).json({ message: 'Not found.' }))

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ message: 'Something went wrong. Please try again.' })
})
export default app
