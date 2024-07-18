import { date, index, numeric, pgEnum, pgSequence, pgTable, text, varchar } from 'drizzle-orm/pg-core'
import { users } from './users'
import { AppraisalService, ProjectStatus, ServiceName } from '@/constants'

// Define the sequence
export const projectsSequence = pgSequence('projects_seq', {
  startWith: 1000,
  minValue: 1000,
  cycle: true,
})

// Define enum values
// export const statusEnum = pgEnum('status', ['Unpaid', 'Completed', 'Canceled', 'Refunded'])
export const statusEnum = pgEnum('status', Object.values(ProjectStatus))
export const serviceEnum = pgEnum('service', Object.values(ServiceName))
export const appraisalServiceEnum = pgEnum('appraisal', Object.values(AppraisalService))

export const projects = pgTable('projects', {
  name: varchar('name', { length: 8 }).primaryKey(),
  userId: varchar('user_id', { length: 256 }).references(() => users.id, { onDelete: 'cascade' }).notNull(),
  status: statusEnum('status').notNull().default(ProjectStatus.Unpaid),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  service: serviceEnum('service').notNull(),
  appraisal: appraisalServiceEnum('appraisal'), // not a null if service is Appraisal
  address: text('address'), // not a null if service is Appraisal
  submittedAt: date('submitted_at', { mode: 'date' }).notNull().defaultNow(),
  processedAt: date('processed_at', { mode: 'date' }),
  // createdAt: customTimestamp('created_at', { withTimezone: true }).notNull().default(sql`now()`),
} as any, table => ({
  submittedAt: index('projects_submitted_at_idx').on(table.submittedAt),
  processedAt: index('projects_processed_at_idx').on(table.processedAt),
}))

export type Project = typeof projects.$inferSelect // return type when queried
export type InsertProject = typeof projects.$inferInsert // insert type
