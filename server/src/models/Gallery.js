import mongoose from 'mongoose'
export default mongoose.model('Gallery', new mongoose.Schema({ url: { type: String, required: true }, caption: { type: String, default: '' } }, { timestamps: true }))
