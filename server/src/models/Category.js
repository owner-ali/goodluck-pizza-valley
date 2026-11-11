import mongoose from 'mongoose'
const schema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, name: { type: String, required: true, trim: true },
  world: { type: String, enum: ['pizza', 'ice'], default: 'pizza' }, order: { type: Number, default: 0 },
})
export default mongoose.model('Category', schema)
