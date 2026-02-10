import { Router } from 'express'
import {
  getReservationsForApartment,
  createReservation,
  updateReservation,
  deleteReservation,
} from '../controllers/reservations.controller.js'

const router = Router()

// GET /reservations?apartmentId=&from=&to=
router.get('/', async (req, res, next) => {
  try {
    const { apartmentId, from, to } = req.query

    if (!apartmentId || !from || !to) {
      return res.status(400).json({ message: 'apartmentId, from, to are required' })
    }

    const rows = await getReservationsForApartment({ apartmentId, from, to })
    res.json(rows)
  } catch (e) {
    next(e)
  }
})

// POST /reservations
router.post('/', async (req, res, next) => {
  try {
    const { apartmentId, guestName, startDate, endDate } = req.body

    if (!apartmentId || !guestName || !startDate || !endDate) {
      return res.status(400).json({
        message: 'apartmentId, guestName, startDate, endDate are required',
      })
    }

    const created = await createReservation(req.body)
    res.status(201).json(created)
  } catch (e) {
    next(e)
  }
})

// PUT /reservations/:id
router.put('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const { apartmentId, guestName, startDate, endDate } = req.body

    if (!id) return res.status(400).json({ message: 'invalid id' })
    if (!apartmentId || !guestName || !startDate || !endDate) {
      return res.status(400).json({
        message: 'apartmentId, guestName, startDate, endDate are required',
      })
    }

    const affected = await updateReservation({ id, ...req.body })
    if (affected === 0) return res.status(404).json({ message: 'Not found' })
    res.json({ ok: true })
  } catch (e) {
    next(e)
  }
})

// DELETE /reservations/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    if (!id) return res.status(400).json({ message: 'invalid id' })

    const affected = await deleteReservation(id)
    if (affected === 0) return res.status(404).json({ message: 'Not found' })
    res.json({ ok: true })
  } catch (e) {
    next(e)
  }
})

export default router
