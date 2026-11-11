import Setting from '../models/Setting.js'
export async function getSettings() {
  const s = (await Setting.findOne({ key: 'main' }).lean()) ?? (await Setting.create({ key: 'main' })).toObject()
  const { _id, __v, key, createdAt, updatedAt, ...rest } = s
  return rest
}
