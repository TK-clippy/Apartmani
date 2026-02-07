import { pool } from '../db/pool.js'

export async function getReservationsForApartment({ apartmentId, from, to }) {
  const [rows] = await pool.query(
    `
    SELECT
      id,
      apartment_id,
      guest_name,
      start_date,
      end_date
    FROM reservations
    WHERE apartment_id = ?
      AND start_date < ?
      AND end_date > ?
    ORDER BY start_date
    `,
    [apartmentId, to, from]
  )

  return rows
}

export async function createReservation({
  apartmentId,
  guestName,
  startDate,
  endDate,
  guestsCount,
  notes,
}) {
  const [result] = await pool.query(
    `
    INSERT INTO reservations
      (apartment_id, guest_name, start_date, end_date, guests_count, notes)
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      apartmentId,
      guestName,
      startDate,
      endDate,
      guestsCount ?? null,
      notes ?? null,
    ]
  )

  return {
    id: result.insertId,
    apartmentId,
    guestName,
    startDate,
    endDate,
    guestsCount,
    notes,
  }
}
