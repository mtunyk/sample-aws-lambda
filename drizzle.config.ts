import { defineConfig } from 'drizzle-kit'
import { dbCredentials } from '@/db'

import type { Config } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials,
  schema: './src/models/*.ts',
  out: './db/migrations',
} satisfies Config)
