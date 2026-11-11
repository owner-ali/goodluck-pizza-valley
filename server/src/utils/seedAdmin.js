// npm run seed:admin  -> creates/updates the admin from ADMIN_EMAIL and ADMIN_PASSWORD (server/.env)
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import Admin from '../models/Admin.js'
const { ADMIN_EMAIL, ADMIN_PASSWORD, MONGODB_URI } = process.env
if (!ADMIN_EMAIL || !ADMIN_PASSWORD || ADMIN_PASSWORD.length < 10) { console.error('Set ADMIN_EMAIL and an ADMIN_PASSWORD of 10+ characters in server/.env'); process.exit(1) }
await mongoose.connect(MONGODB_URI)
await Admin.findOneAndUpdate({ email: ADMIN_EMAIL.toLowerCase().trim() }, { passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 12) }, { upsert: true })
console.log('Admin ready. Remove ADMIN_PASSWORD from .env now.')
await mongoose.disconnect()
