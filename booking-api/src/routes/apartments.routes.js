import { Router } from 'express'
import { listApartments } from '../controllers/apartments.controller.js'

const router = Router()
router.get('/', listApartments)
export default router
