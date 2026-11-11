import mongoose from 'mongoose'
export const ORDER_STATUSES = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled']
const line = new mongoose.Schema({ productId: String, name: String, size: String, addons: [String], qty: Number, unitPrice: Number }, { _id: false })
const schema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  customer: { name: { type: String, required: true }, phone: { type: String, required: true, index: true } },
  type: { type: String, enum: ['delivery', 'pickup'], required: true },
  address: { type: String, default: '' }, notes: { type: String, default: '' },
  lines: { type: [line], validate: (v) => v.length > 0 },
  subtotal: Number, deliveryFee: Number, total: Number,
  payment: { type: String, enum: ['cod'], default: 'cod' },
  status: { type: String, enum: ORDER_STATUSES, default: 'pending', index: true },
}, { timestamps: true })
export default mongoose.model('Order', schema)
