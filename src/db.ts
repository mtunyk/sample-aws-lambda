import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

export const dbCredentials = {
  host: process.env.DB_HOST!,
  port: 5432,
  user: 'sampletld',
  password: 'xxx',
  database: 'sampletld',
  ssl: {
    rejectUnauthorized: false,
  }
}

const queryClient = postgres(dbCredentials)

// Initialize Drizzle ORM
const db = drizzle(queryClient)

export default db
