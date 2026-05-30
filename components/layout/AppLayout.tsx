"use client"

import * as React from "react"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { SlideOver } from "@/components/ui/SlideOver"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false)

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden xl:flex" />

      {/* Mobile Sidebar (Drawer) */}
      <SlideOver 
        isOpen={isMobileSidebarOpen} 
        onClose={() => setIsMobileSidebarOpen(false)}
        title="Menu"
      >
        <Sidebar 
          className="w-full border-r-0" 
          onItemClick={() => setIsMobileSidebarOpen(false)} 
        />
      </SlideOver>

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onMenuClick={() => setIsMobileSidebarOpen(true)} />
        <main className="flex-1 overflow-x-auto overflow-y-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
