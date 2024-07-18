'use server'

import { count, ilike, sql } from 'drizzle-orm'
import db from '@/db'
import { projects } from '@/models/projects'

import type { Project, InsertProject } from '@/models/projects'
import type { PagedData } from '@/types/PagedData'

// Generates a unique custom name for the project following the pattern REYYXXXX
async function generateProjectName(): Promise<string> {
  const currentYear = new Date().getFullYear().toString().slice(-2) // "24" for 2024
  const prefix = `RE${currentYear}`

  // Get the next sequence value
  const result = await db.execute(sql`SELECT nextval('projects_seq')`)
  const nextVal = result[0].nextval

  return `${prefix}${nextVal}`
}

export const getProjects = async (search: string, offset: number): Promise<PagedData<Project>> => {
  // Always search the full table, not per page
  if (search) {
    return {
      items: await db.select()
        .from(projects)
        .where(ilike(projects.name, `%${search}%`))
        .groupBy(projects.status)
        .limit(1000),
      newOffset: null,
      total: 0,
    };
  }

  if (offset === null) {
    return { items: [], newOffset: null, total: 0 };
  }

  let totalItems = await db.select({ count: count() }).from(projects);
  let moreItems = await db.select().from(projects).limit(5).offset(offset);
  let newOffset = moreItems.length >= 5 ? offset + 5 : null;

  return {
    items: moreItems,
    newOffset,
    total: totalItems[0].count
  }
}
