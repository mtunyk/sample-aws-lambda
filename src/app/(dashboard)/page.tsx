import { File, PlusCircle } from 'lucide-react'
import { ProjectStatus } from '@/constants'
import { getProjects } from '@/actions/projects'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Button from '@/components/ui/Button'
import { DataGrid } from '@/components/ui/grid'

import type { Metadata } from 'next'
import type { Project } from '@/types/Project'
import type { PagedData } from '@/types/PagedData'

export interface ProjectsPageProps {
  searchParams: { q: string; offset: string };
}

export const metadata: Metadata = {
  title: 'Projects | sampletld',
}

async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const search: string = searchParams.q ?? ''
  const offset: number = Number(searchParams.offset ?? 0)
  const { items: projects, newOffset, total }: PagedData<Project> = await getProjects(search, offset)

  return (
    <Tabs defaultValue={ProjectStatus.Unpaid} className="border border-dashed border-1 border-orange-500">
      <div className="flex items-center border border-dashed border-1 border-green-500">
        <TabsList>
          {Object.values(ProjectStatus).map((status) => (
            <TabsTrigger key={status} value={status}>
              {status}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Project
            </span>
          </Button>
        </div>
      </div>
      {Object.values(ProjectStatus).map((status) => (
        <>
          <TabsContent value={status}>
            <DataGrid
              items={projects}
              offset={newOffset ?? 0}
              total={total}
            />
          </TabsContent>
        </>
      ))}
    </Tabs>
  )
}

export default ProjectsPage
