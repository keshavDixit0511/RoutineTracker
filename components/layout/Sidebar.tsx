"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ListTodo, Settings, Users, LayoutDashboard, LayoutTemplate, Plus, CalendarDays, Timer } from "lucide-react"
import { useBoard } from "@/context/BoardContext"
import { SlideOver } from "@/components/ui/SlideOver"
import { ProjectForm } from "@/components/project/ProjectForm"
import { Project } from "@/types"

export function Sidebar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const pathname = usePathname()
  const { boardData, setActiveProjectId, addProject } = useBoard()
  const [isProjectModalOpen, setIsProjectModalOpen] = React.useState(false)
  
  if (!boardData) return null

  const { projects = [], activeProjectId } = boardData

  const handleAddProject = (projectData: Omit<Project, "id">) => {
    addProject(projectData)
    setIsProjectModalOpen(false)
  }

  const items = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: LayoutTemplate, label: "Board View", href: "/" },
    { icon: ListTodo, label: "My Tasks", href: "/tasks" },
    { icon: CalendarDays, label: "Daily Tasks", href: "/daily" },
    { icon: Timer, label: "Pomodoro Focus", href: "/pomodoro" },
    { icon: Users, label: "Team", href: "/team" },
  ]

  return (
    <div
      className={cn(
        "flex h-full w-full xl:w-64 flex-col border-r border-border bg-surface",
        className
      )}
      {...props}
    >
      <div className="flex h-16 items-center border-b border-border px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <LayoutTemplate className="h-4 w-4 text-background" />
          </div>
          <span className="font-semibold tracking-tight text-foreground">
            RoutineTrack
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 custom-scrollbar">
        <nav className="space-y-1 px-4">
          {items.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-text-muted hover:bg-surface-hover hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="mt-8 px-4">
          <div className="mb-2 flex items-center justify-between px-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Projects
            </h3>
            <button 
              onClick={() => setIsProjectModalOpen(true)}
              className="rounded-md p-1 text-text-muted transition-colors hover:bg-surface-hover hover:text-primary"
              title="Create New Project"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          <nav className="space-y-1">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => setActiveProjectId(project.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  activeProjectId === project.id
                    ? "bg-surface-hover text-foreground"
                    : "text-text-muted hover:bg-surface-hover hover:text-foreground"
                )}
              >
                <div className={cn("h-2 w-2 rounded-full", project.color)} />
                {project.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="border-t border-border p-4">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-surface-hover hover:text-foreground">
          <Settings className="h-4 w-4" />
          Settings
        </button>
      </div>

      <SlideOver
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        title="Initialize New Project"
      >
        <div className="pt-2">
          <ProjectForm 
            onSubmit={handleAddProject}
            onCancel={() => setIsProjectModalOpen(false)}
          />
        </div>
      </SlideOver>
    </div>
  )
}
