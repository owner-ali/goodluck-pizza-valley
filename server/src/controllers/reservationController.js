import crypto from 'node:crypto'
import Reservation from '../models/Reservation.js'
import { checkSlot, normalizePhone } from '../utils/validate.js'

export async function createReservation(req, res, next) {
  try {
    const { name, phone, date, time, guests, notes } = req.body
    const problem = checkSlot(date, time)
    if (problem) return res.status(400).json({ message: problem })
    const r = await Reservation.create({ reservationId: 'RS-' + crypto.randomBytes(3).toString('hex').toUpperCase(),
      name: name.trim(), phone: normalizePhone(phone), date, time, guests, notes: notes ?? '' })
    res.status(201).json({ reservationId: r.reservationId, status: r.status })
  } catch (e) { next(e) }
}

export async function trackReservation(req, res, next) {
  try {
    const r = await Reservation.findOne({ reservationId: String(req.body.id).toUpperCase(), phone: normalizePhone(req.body.phone) }).lean()
    if (!r) return res.status(404).json({ message: 'No reservation found with those details.' })
    res.json({ reservationId: r.reservationId, status: r.status, date: r.date, time: r.time, guests: r.guests })
  } catch (e) { next(e) }
}
