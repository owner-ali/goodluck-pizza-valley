import mongoose from 'mongoose'
export default mongoose.model('Review', new mongoose.Schema({
  name: { type: String, required: true, maxlength: 60 }, rating: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String, required: true, maxlength: 500 }, status: { type: String, enum: ['pending', 'approved'], default: 'pending', index: true },
}, { timestamps: true }))
