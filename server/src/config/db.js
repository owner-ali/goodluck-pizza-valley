import mongoose from 'mongoose'
// One connection per server instance (important on serverless: warm invocations reuse it).
let pending = null
export function connectDB() {
  if (mongoose.connection.readyState === 1) return Promise.resolve()
  if (!pending) {
    pending = mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 }).catch((e) => { pending = null; throw e })
  }
  return pending
}
