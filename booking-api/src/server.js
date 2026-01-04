import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'

import apartmentsRoutes from './routes/apartments.routes.js'
import reservationsRoutes from './routes/reservations.routes.js'

dotenv.config()

const app = express()

app.use(helmet())
app.use(
  cors({
    origin: true, // later lock this down to your frontend domain
    credentials: true,
  }),
)
app.use(express.json())

app.get('/health', (req, res) => res.json({ ok: true }))

app.use('/apartments', apartmentsRoutes)
app.use('/reservations', reservationsRoutes)

// basic error handler
app.use((err, req, res, _next) => {
  console.error(err)
  res.status(err.status || 500).json({
    message: err.message || 'Server error',
  })
})

app.listen(process.env.PORT || 3000, () => {
  console.log(`API listening on port ${process.env.PORT || 3000}`)
})
