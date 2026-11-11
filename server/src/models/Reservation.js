import mongoose from 'mongoose'
export const RES_STATUSES = ['pending', 'approved', 'rejected', 'cancelled']
const schema = new mongoose.Schema({
  reservationId: { type: String, required: true, unique: true },
  name: { type: String, required: true }, phone: { type: String, required: true, index: true },
  date: { type: String, required: true }, time: { type: String, required: true },
  guests: { type: Number, required: true, min: 1, max: 20 }, notes: { type: String, default: '' },
  status: { type: String, enum: RES_STATUSES, default: 'pending', index: true },
}, { timestamps: true })
export default mongoose.model('Reservation', schema)
