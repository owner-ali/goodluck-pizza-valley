import { Router } from 'express'
import { getMenu } from '../controllers/menuController.js'
const r = Router()
r.get('/', getMenu)
export default r
