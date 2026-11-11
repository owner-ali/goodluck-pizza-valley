import { Router } from 'express'
import multer from 'multer'
import rateLimit from 'express-rate-limit'
import { body } from 'express-validator'
import { requireAdmin } from '../middleware/auth.js'
import { check } from '../validators/index.js'
import * as c from '../controllers/adminController.js'

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 2 * 1024 * 1024, files: 1 } })
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, message: { message: 'Too many sign-in attempts. Please wait 15 minutes.' } })
const r = Router()

r.post('/login', loginLimiter, body('email').isEmail().withMessage('Enter a valid email.'), body('password').isString().isLength({ min: 1, max: 200 }).withMessage('Enter your password.'), check, c.login)
r.use(requireAdmin)
r.get('/stats', c.stats)
r.get('/orders', c.listOrders); r.patch('/orders/:id', c.setOrderStatus)
r.get('/reservations', c.listReservations); r.patch('/reservations/:id', c.setReservationStatus)
r.get('/customers', c.listCustomers)
r.get('/categories', c.listCategories); r.post('/categories', c.saveCategory); r.put('/categories/:id', c.saveCategory); r.delete('/categories/:id', c.deleteCategory)
r.get('/products', c.listProducts); r.post('/products', c.createProduct); r.put('/products/:id', c.updateProduct); r.delete('/products/:id', c.deleteProduct)
r.post('/upload', (req, res, next) => upload.single('image')(req, res, (e) => (e ? res.status(400).json({ message: 'Image too large (max 2 MB) or invalid upload.' }) : next())), c.uploadImage)
r.get('/gallery', c.listGallery); r.post('/gallery', c.addGallery); r.delete('/gallery/:id', c.deleteGallery)
r.get('/reviews', c.listReviews); r.patch('/reviews/:id/approve', c.approveReview); r.delete('/reviews/:id', c.deleteReview)
r.get('/messages', c.listMessages); r.delete('/messages/:id', c.deleteMessage)
r.get('/settings', c.readSettings); r.put('/settings', c.writeSettings)
export default r
