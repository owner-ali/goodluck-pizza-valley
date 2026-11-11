import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { body } from 'express-validator'
import { check } from '../validators/index.js'
import Gallery from '../models/Gallery.js'
import Review from '../models/Review.js'
import Message from '../models/Message.js'
import { getSettings } from '../utils/settingsStore.js'

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, message: { message: 'Too many submissions. Please try again later.' } })
const r = Router()
const safe = (fn) => async (req, res, next) => { try { await fn(req, res) } catch (e) { next(e) } }

r.get('/settings', safe(async (_q, res) => res.json(await getSettings())))
r.get('/gallery', safe(async (_q, res) => res.json(await Gallery.find().sort('-createdAt').limit(60).select('url caption -_id').lean())))
r.get('/reviews', safe(async (_q, res) => res.json(await Review.find({ status: 'approved' }).sort('-createdAt').limit(60).select('name rating text createdAt -_id').lean())))
r.post('/reviews', limiter,
  body('name').isString().trim().isLength({ min: 2, max: 60 }).withMessage('Enter your name.'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Choose a rating from 1 to 5.').toInt(),
  body('text').isString().trim().isLength({ min: 5, max: 500 }).withMessage('Write 5 to 500 characters.'), check,
  safe(async (req, res) => { await Review.create({ name: req.body.name, rating: req.body.rating, text: req.body.text }); res.status(201).json({ ok: true }) }))
r.post('/messages', limiter,
  body('name').isString().trim().isLength({ min: 2, max: 80 }).withMessage('Enter your name.'),
  body('contact').isString().trim().isLength({ min: 5, max: 120 }).withMessage('Enter a phone number or email so we can reply.'),
  body('message').isString().trim().isLength({ min: 5, max: 1000 }).withMessage('Write 5 to 1000 characters.'), check,
  safe(async (req, res) => { await Message.create({ name: req.body.name, contact: req.body.contact, message: req.body.message }); res.status(201).json({ ok: true }) }))
export default r
