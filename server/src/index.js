// Local / Docker entry point. (Netlify uses netlify/functions/api.mjs instead.)
import app from './app.js'
import { connectDB } from './config/db.js'
try {
  await connectDB()
  app.listen(process.env.PORT || 5000, () => console.log('API ready'))
} catch (e) {
  console.error('MongoDB connection failed:', e.message)
  process.exit(1)
}
