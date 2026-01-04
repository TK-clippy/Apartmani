import { pool } from '../db/pool.js'

export async function listReservations(req, res, next) {
  try {
    const apartmentId = Number(req.query.apartmentId)
    const from = req.query.from
    const to = req.query.to

    if (!apartmentId || !from || !to) {
      return res.status(400).json({ message: 'apartmentId, from, to are required' })
    }

    // overlap logic for [start_date, end_date)
    const [rows] = await pool.query(
      `
      SELECT id, apartment_id, guest_name, start_date, end_date, guests_count, notes, status
      FROM reservations
      WHERE apartment_id = ?
        AND status <> 'cancelled'
        AND start_date < ?
        AND end_date > ?
      ORDER BY start_date
      `,
      [apartmentId, to, from],
    )

    res.json(rows)
  } catch (e) {
    next(e)
  }
}

export async function createReservation(req, res, next) {
  try {
    const { apartmentId, guestName, startDate, endDate, guestsCount, notes } = req.body

    if (!apartmentId || !guestName || !startDate || !endDate) {
      return res
        .status(400)
        .json({ message: 'apartmentId, guestName, startDate, endDate are required' })
    }

    const payload = [apartmentId, guestName, startDate, endDate, guestsCount ?? 1, notes ?? null]

    // triggers will reject overlaps + invalid date ranges
    const [result] = await pool.query(
      `
      INSERT INTO reservations
        (apartment_id, guest_name, start_date, end_date, guests_count, notes)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      payload,
    )

    res.status(201).json({ id: result.insertId })
  } catch (e) {
    // MariaDB trigger uses SIGNAL SQLSTATE '45000'
    if (e?.sqlState === '45000') {
      return res.status(409).json({ message: e.message })
    }
    next(e)
  }
}
