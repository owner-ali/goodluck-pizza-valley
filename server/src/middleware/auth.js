import jwt from 'jsonwebtoken'
export function requireAdmin(req, res, next) {
  const h = req.headers.authorization || ''
  try { req.admin = jwt.verify(h.startsWith('Bearer ') ? h.slice(7) : '', process.env.JWT_SECRET); next() }
  catch { res.status(401).json({ message: 'Please sign in again.' }) }
}
