import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import { pool } from '../db/pool.js'

dotenv.config()

async function run() {
  const email = process.argv[2]
  const password = process.argv[3]

  if (!email || !password) {
    console.log('Usage: node src/scripts/create-admin.js email password')
    process.exit(1)
  }

  try {
    const hash = await bcrypt.hash(password, 12)

    await pool.query(
      'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
      [email, hash, 'admin']
    )

    console.log('✅ Admin created:', email)
    process.exit(0)
  } catch (err) {
    console.error('❌ Error:', err.message)
    process.exit(1)
  }
}

run()
