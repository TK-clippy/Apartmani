import { pool } from '../db/pool.js'

export async function getReservationsForApartment({ apartmentId, from, to }) {
  const [rows] = await pool.query(
    `
    SELECT
      id,
      apartment_id,
      guest_name,
      start_date,
      end_date,
      guests_count,
      notes
    FROM reservations
    WHERE apartment_id = ?
      AND start_date < ?
      AND end_date > ?
    ORDER BY start_date
    `,
    [apartmentId, to, from],
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
    ],
  )

  return {
    id: result.insertId,
    apartmentId,
    guestName,
    startDate,
    endDate,
    guestsCount: guestsCount ?? null,
    notes: notes ?? null,
  }
}

export async function updateReservation({
  id,
  apartmentId,
  guestName,
  startDate,
  endDate,
  guestsCount,
  notes,
}) {
  const [result] = await pool.query(
    `
    UPDATE reservations
    SET
      apartment_id = ?,
      guest_name = ?,
      start_date = ?,
      end_date = ?,
      guests_count = ?,
      notes = ?
    WHERE id = ?
    `,
    [
      apartmentId,
      guestName,
      startDate,
      endDate,
      guestsCount ?? null,
      notes ?? null,
      id,
    ],
  )

  return result.affectedRows
}

export async function deleteReservation(id) {
  const [result] = await pool.query('DELETE FROM reservations WHERE id = ?', [id])
  return result.affectedRows
}
