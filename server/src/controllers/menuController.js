import Category from '../models/Category.js'
import Product from '../models/Product.js'
// Public menu. Admin CRUD (Phase 7) will reuse the same models.
export async function getMenu(_req, res, next) {
  try {
    const [categories, items] = await Promise.all([
      Category.find().sort('order').select('-_id -__v -order').lean(),
      Product.find({ available: true }).select('-_id -__v -createdAt -updatedAt').lean(),
    ])
    res.json({ categories, items })
  } catch (e) { next(e) }
}
