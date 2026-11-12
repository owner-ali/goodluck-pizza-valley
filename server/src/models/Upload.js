import mongoose from 'mongoose'
// Uploaded photos live in MongoDB (serverless hosts have no permanent disk). Max 2 MB each.
export default mongoose.model('Upload', new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  mime: { type: String, required: true },
  data: { type: Buffer, required: true },
}, { timestamps: true }))
