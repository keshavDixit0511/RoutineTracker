"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Search, Bell, Menu } from "lucide-react"
import { useBoard } from "@/context/BoardContext"
import { cn } from "@/lib/utils"

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
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
    <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-4 md:px-6">
      <div className="flex items-center gap-3 md:gap-4">
        <button 
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-hover/50 text-text-muted transition-colors hover:bg-primary/10 hover:text-primary xl:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-sm md:text-lg font-semibold text-foreground truncate max-w-[150px] md:max-w-none">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="h-9 w-40 lg:w-64 rounded-xl border border-border bg-background pl-9 pr-4 text-sm text-foreground placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          />
        </div>

        <button className="sm:hidden p-2 text-text-muted hover:text-foreground">
          <Search className="h-5 w-5" />
        </button>

        <button className="relative rounded-full p-2 text-text-muted transition-colors hover:bg-surface-hover hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-gold" />
        </button>

        <div className="h-8 w-8 overflow-hidden rounded-full border border-border shrink-0">
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
