import jwt from 'jsonwebtoken'

export function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || ''
    const [type, token] = header.split(' ')

    if (type !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Missing Bearer token' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // standardno: sub = user id
    req.user = {
      id: Number(decoded.sub),
      role: decoded.role,
    }

    next()
  } catch (e) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' })
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' })
    next()
  }
}
