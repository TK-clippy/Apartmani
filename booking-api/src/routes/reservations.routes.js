import { Router } from 'express'
import {
  getReservationsForApartment,
  createReservation,
} from '../controllers/reservations.controller.js'

const router = Router()

// GET — calendar fetch
router.get('/', async (req, res, next) => {
  try {
    const { apartmentId, from, to } = req.query

    if (!apartmentId || !from || !to) {
      return res.status(400).json({
        message: 'apartmentId, from, to are required',
      })
    }

    const reservations = await getReservationsForApartment({
      apartmentId,
      from,
      to,
    })

    res.json(reservations)
  } catch (err) {
    next(err)
  }
})

// POST — create reservation
router.post('/', async (req, res, next) => {
  try {
    const { apartmentId, guestName, startDate, endDate, guestsCount } = req.body

    if (
      !apartmentId ||
      !guestName ||
      !startDate ||
      !endDate ||
      !guestsCount
    ) {
      return res.status(400).json({
        message: 'apartmentId, guestName, startDate, endDate, guestsCount are required',
      })
    }

    const reservation = await createReservation(req.body)
    res.status(201).json(reservation)
  } catch (err) {
    next(err)
  }
})


export default router
