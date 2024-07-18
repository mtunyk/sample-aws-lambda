import { date, index, pgTable, varchar } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: varchar('id', { length: 256 }).primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  email: varchar('email', { length: 256 }).notNull().unique(),
  phone: varchar('phone', { length: 256 }).notNull().unique(),
  createdAt: date('created_at', { mode: 'date' }).notNull().defaultNow(),
  // createdAt: timestamp('created_at', { precision: 6, withTimezone: true }).default(sql`NOW()`)
} as any, table => ({
  nameIdx: index('users_name_idx').on(table.name),
  createdAtIdx: index('users_created_at_idx').on(table.createdAt),
}))

export type User = typeof users.$inferSelect; // return type when queried
export type NewUser = typeof users.$inferInsert; // insert type
