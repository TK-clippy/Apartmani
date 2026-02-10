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

export async function createApartment(req, res, next) {
  try {
    const { name, capacity } = req.body
    if (!name) return res.status(400).json({ message: 'name is required' })

    const [result] = await pool.query(
      'INSERT INTO apartments (name, capacity) VALUES (?, ?)',
      [name, capacity ?? null],
    )

    res.status(201).json({
      id: result.insertId,
      name,
      capacity: capacity ?? null,
    })
  } catch (e) {
    next(e)
  }
}

export async function updateApartment(req, res, next) {
  try {
    const id = Number(req.params.id)
    const { name, capacity } = req.body
    if (!id) return res.status(400).json({ message: 'invalid id' })
    if (!name) return res.status(400).json({ message: 'name is required' })

    const [result] = await pool.query(
      'UPDATE apartments SET name = ?, capacity = ? WHERE id = ?',
      [name, capacity ?? null, id],
    )

    if (result.affectedRows === 0) return res.status(404).json({ message: 'Not found' })
    res.json({ ok: true })
  } catch (e) {
    next(e)
  }
}

export async function deleteApartment(req, res, next) {
  try {
    const id = Number(req.params.id)
    if (!id) return res.status(400).json({ message: 'invalid id' })

    const [result] = await pool.query('DELETE FROM apartments WHERE id = ?', [id])

    if (result.affectedRows === 0) return res.status(404).json({ message: 'Not found' })
    res.json({ ok: true })
  } catch (e) {
    next(e)
  }
}
