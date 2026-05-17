"use client"

import * as React from "react"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar className="hidden md:flex" />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-auto overflow-y-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
