import mongoose from 'mongoose'
const option = new mongoose.Schema({ id: String, label: { type: String, required: true }, price: { type: Number, required: true, min: 0 }, group: String }, { _id: false })
const schema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, categoryId: { type: String, required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 120 }, description: { type: String, default: '', maxlength: 400 },
  emoji: { type: String, default: '🍽️' }, compareAt: { type: Number, min: 0, default: null }, image: { type: String, default: '' }, veg: { type: Boolean, default: false }, spicy: Boolean, popular: Boolean,
  available: { type: Boolean, default: true }, color: String,
  sizes: { type: [option], validate: (v) => v.length > 0 }, addons: { type: [option], default: [] },
}, { timestamps: true })
export default mongoose.model('Product', schema)
