import mongoose from 'mongoose'
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
// ALL values below are PLACEHOLDERS. The owner replaces them in the admin panel.
const schema = new mongoose.Schema({
  key: { type: String, default: 'main', unique: true },
  contact: { address: { type: String, default: '[Address: set in admin panel]' }, phone: { type: String, default: '[Phone: set in admin panel]' }, email: { type: String, default: '' }, whatsapp: { type: String, default: '' } },
  social: { facebook: { type: String, default: '' }, instagram: { type: String, default: '' }, tiktok: { type: String, default: '' } },
  hours: { type: [{ day: String, hours: String, _id: false }], default: () => days.map((day) => ({ day, hours: '[Set in admin panel]' })) },
  about: { type: String, default: 'Welcome to Good Luck Pizza Valley & Ice Bar. This text is a placeholder. The owner edits it in the admin panel.' },
  faqs: { type: [{ q: String, a: String, _id: false }], default: [] },
  deals: { type: [{ title: String, description: String, _id: false }], default: [] },
  deliveryFee: { type: Number, default: () => Number(process.env.DELIVERY_FEE ?? 0) || 0, min: 0 },
})
export default mongoose.model('Setting', schema)
