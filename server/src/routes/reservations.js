import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { createReservation, trackReservation } from '../controllers/reservationController.js'
import { check, reservationRules, trackRules } from '../validators/index.js'
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, message: { message: 'Too many requests. Please wait a few minutes and try again.' } })
const r = Router()
r.post('/', limiter, reservationRules, check, createReservation)
r.post('/track', limiter, trackRules, check, trackReservation)
export default r
