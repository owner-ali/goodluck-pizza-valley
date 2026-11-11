import { body, validationResult } from 'express-validator'
import { isPhone } from '../utils/validate.js'

export const orderRules = [
  body('customer.name').isString().trim().isLength({ min: 2, max: 80 }).withMessage('Enter your full name.'),
  body('customer.phone').custom(isPhone).withMessage('Enter a valid phone number.'),
  body('type').isIn(['delivery', 'pickup']).withMessage('Choose delivery or pickup.'),
  body('address').optional({ values: 'falsy' }).isString().trim().isLength({ max: 250 }),
  body('address').if(body('type').equals('delivery')).isString().trim().isLength({ min: 8, max: 250 }).withMessage('Enter your full delivery address.'),
  body('notes').optional({ values: 'falsy' }).isString().trim().isLength({ max: 300 }),
  body('lines').isArray({ min: 1, max: 30 }).withMessage('Your cart is empty.'),
  body('lines.*.itemId').isString().isLength({ max: 40 }),
  body('lines.*.sizeId').isString().isLength({ max: 60 }),
  body('lines.*.addonIds').optional().isArray({ max: 20 }),
  body('lines.*.addonIds.*').isString().isLength({ max: 60 }),
]
export const reservationRules = [
  body('name').isString().trim().isLength({ min: 2, max: 80 }).withMessage('Enter your full name.'),
  body('phone').custom(isPhone).withMessage('Enter a valid phone number.'),
  body('date').isString().withMessage('Choose a date.'),
  body('time').isString().withMessage('Choose a time.'),
  body('guests').isInt({ min: 1, max: 20 }).withMessage('Guests must be between 1 and 20.').toInt(),
  body('notes').optional({ values: 'falsy' }).isString().trim().isLength({ max: 300 }),
]
export const trackRules = [
  body('id').isString().trim().isLength({ min: 4, max: 30 }).withMessage('Enter your ID.'),
  body('phone').custom(isPhone).withMessage('Enter the phone number used when booking.'),
]
// Reads the first validation error and answers 400 with a plain message.
export function check(req, res, next) {
  const e = validationResult(req)
  if (e.isEmpty()) return next()
  res.status(400).json({ message: e.array()[0].msg === 'Invalid value' ? 'Please check your details and try again.' : e.array()[0].msg })
}
