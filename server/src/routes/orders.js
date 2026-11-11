import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { createOrder, trackOrder } from '../controllers/orderController.js'
import { check, orderRules, trackRules } from '../validators/index.js'
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, message: { message: 'Too many requests. Please wait a few minutes and try again.' } })
const r = Router()
r.post('/', limiter, orderRules, check, createOrder)
r.post('/track', limiter, trackRules, check, trackOrder)
export default r
