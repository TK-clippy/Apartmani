import { pool } from '../db/pool.js'

export async function listApartments(req, res, next) {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, capacity, created_at FROM apartments ORDER BY name',
    )
    res.json(rows)
  } catch (e) {
    next(e)
  }
}
