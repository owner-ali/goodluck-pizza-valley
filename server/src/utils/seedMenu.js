// npm run seed  -> loads the SAMPLE menu into MongoDB (replaces existing menu data)
import fs from 'node:fs'
import mongoose from 'mongoose'
import Category from '../models/Category.js'
import Product from '../models/Product.js'

const raw = JSON.parse(fs.readFileSync(new URL('../../../client/src/data/menu.sample.json', import.meta.url), 'utf8'))
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const opt = (o) => ({ ...o, id: o.id ?? slug(o.label) })

await mongoose.connect(process.env.MONGODB_URI)
await Promise.all([Category.deleteMany({}), Product.deleteMany({})])
await Category.insertMany(raw.categories.map((c, order) => ({ ...c, order })))
await Product.insertMany(raw.items.map((i) => ({
  ...i, sizes: i.sizes.map(opt),
  addons: (typeof i.addons === 'string' ? raw.addonSets[i.addons] ?? [] : i.addons ?? []).map(opt),
})))
console.log(`Seeded ${raw.categories.length} categories and ${raw.items.length} products`)
await mongoose.disconnect()
