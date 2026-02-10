import { Router } from 'express'
import {
  listApartments,
  createApartment,
  updateApartment,
  deleteApartment,
} from '../controllers/apartments.controller.js'

const router = Router()

router.get('/', listApartments)
router.post('/', createApartment)
router.put('/:id', updateApartment)
router.delete('/:id', deleteApartment)

export default router
