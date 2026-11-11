import { fileURLToPath } from 'node:url'
export const UPLOAD_DIR = fileURLToPath(new URL('../uploads', import.meta.url))
