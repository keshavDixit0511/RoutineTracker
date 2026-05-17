"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Search, Bell } from "lucide-react"
import { useBoard } from "@/context/BoardContext"

export function Header() {
  const pathname = usePathname()
  const { boardData } = useBoard()
  
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard"
    if (pathname === "/tasks") return "My Tasks"
    if (pathname === "/team") return "Team"
    
    if (pathname === "/" && boardData) {
      const activeProject = boardData.projects?.find(p => p.id === boardData.activeProjectId)
      return `Board View${activeProject ? ` • ${activeProject.name}` : ""}`
    }
    
    return "RoutineTrack"
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-foreground">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="h-9 w-64 rounded-md border border-border bg-background pl-9 pr-4 text-sm text-foreground placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <button className="relative rounded-full p-2 text-text-muted transition-colors hover:bg-surface-hover hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-gold" />
        </button>

        <div className="h-8 w-8 overflow-hidden rounded-full border border-border">
          <img
            src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=e2e8f0"
            alt="User avatar"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </header>
  )
}
