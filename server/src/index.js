import './config/env.js'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import mongoose from 'mongoose'
import { UPLOAD_DIR } from './config/paths.js'
import { getSettings } from './utils/settingsStore.js'
import menuRoutes from './routes/menu.js'
import orderRoutes from './routes/orders.js'
import reservationRoutes from './routes/reservations.js'
import adminRoutes from './routes/admin.js'
import publicRoutes from './routes/public.js'

const app = express()
app.disable('x-powered-by')
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(cors({ origin: process.env.CLIENT_ORIGIN }))
app.use(express.json({ limit: '100kb' }))
app.use('/uploads', express.static(UPLOAD_DIR, { maxAge: '7d', index: false }))
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 600 }))

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

try {
  await mongoose.connect(process.env.MONGODB_URI)
  app.listen(process.env.PORT || 5000, () => console.log('API ready'))
} catch (e) {
  console.error('MongoDB connection failed:', e.message)
  process.exit(1)
}
