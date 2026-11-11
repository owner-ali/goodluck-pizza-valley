import mongoose from 'mongoose'
export default mongoose.model('Message', new mongoose.Schema({
  name: { type: String, required: true, maxlength: 80 }, contact: { type: String, required: true, maxlength: 120 }, message: { type: String, required: true, maxlength: 1000 },
}, { timestamps: true }))
