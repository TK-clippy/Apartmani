import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool } from '../db/pool.js'

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' })
    }

    const [rows] = await pool.query(
      'SELECT id, email, password_hash, role FROM users WHERE email = ? LIMIT 1',
      [email],
    )

    const user = rows[0]
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })

    const ok = await bcrypt.compare(password, user.password_hash)
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' })

    const access_token = signToken({ sub: user.id, role: user.role })

    res.json({
      access_token,
      user: { id: user.id, email: user.email, role: user.role },
    })
  } catch (e) {
    next(e)
  }
}

export async function me(req, res, next) {
  try {
    // req.user postavlja middleware
    const userId = req.user.id

    const [rows] = await pool.query(
      'SELECT id, email, role, created_at FROM users WHERE id = ? LIMIT 1',
      [userId],
    )

    const user = rows[0]
    if (!user) return res.status(404).json({ message: 'User not found' })

    res.json(user)
  } catch (e) {
    next(e)
  }
}
