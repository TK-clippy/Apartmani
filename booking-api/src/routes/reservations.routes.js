import { Router } from 'express'
import { listReservations, createReservation } from '../controllers/reservations.controller.js'

const router = Router()

router.get('/', listReservations)
router.post('/', createReservation)

export default router
