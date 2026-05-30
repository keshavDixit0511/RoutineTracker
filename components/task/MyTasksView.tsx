"use client"

import * as React from "react"
import { useBoard } from "@/context/BoardContext"
import { Task, Status, Priority } from "@/types"
import { Badge } from "@/components/ui/Badge"
import { Card, CardContent } from "@/components/ui/Card"
import { SlideOver } from "@/components/ui/SlideOver"
import { TaskDetailPanel } from "@/components/task/TaskDetailPanel"
import { Search, Filter, ListTodo, Calendar, User, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export function MyTasksView() {
  const { boardData } = useBoard()
  
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<Status | "All">("All")
  const [priorityFilter, setPriorityFilter] = React.useState<Priority | "All">("All")
  const [projectFilter, setProjectFilter] = React.useState<string | "All">("All")
  
  // Selected task state for details panel
  const [selectedTaskId, setSelectedTaskId] = React.useState<string | null>(null)
  const [isDetailPanelOpen, setIsDetailPanelOpen] = React.useState(false)

  if (!boardData) return null

  const tasks = Object.values(boardData.tasks || {})
  const projects = boardData.projects || []

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          task.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "All" || task.status === statusFilter
    const matchesPriority = priorityFilter === "All" || task.priority === priorityFilter
    const matchesProject = projectFilter === "All" || task.projectId === projectFilter
    
    return matchesSearch && matchesStatus && matchesPriority && matchesProject
  })

  const handleTaskClick = (task: Task) => {
    setSelectedTaskId(task.id)
    setIsDetailPanelOpen(true)
  }

  const activeDetailTask = selectedTaskId ? boardData.tasks[selectedTaskId] : null

  return (
    <div className="p-4 md:p-10 flex flex-col gap-6 md:gap-8 w-full max-w-7xl mx-auto h-full overflow-hidden">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
        <div className="space-y-1 md:space-y-2">
          <h2 className="text-2xl md:text-4xl font-black text-foreground tracking-tighter uppercase italic">
            My <span className="text-primary not-italic tracking-normal">Tasks</span>
          </h2>
          <p className="text-xs md:text-sm text-text-muted font-medium">Manage your personal workload and track progress.</p>
        </div>

        <div className="flex flex-col items-stretch md:items-end gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-surface/50 border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all w-full md:w-64"
            />
          </div>
          
          <div className="flex flex-wrap items-center bg-surface/50 border border-border/50 rounded-xl p-1 gap-1">
            <select 
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="bg-transparent text-[10px] font-black uppercase tracking-wider px-2 py-1.5 focus:outline-none cursor-pointer hover:text-primary transition-colors"
            >
              <option value="All">Projects</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <div className="h-4 w-[1px] bg-border/50" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as Status | "All")}
              className="bg-transparent text-[10px] font-black uppercase tracking-wider px-2 py-1.5 focus:outline-none cursor-pointer hover:text-primary transition-colors"
            >
              <option value="All">Status</option>
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="In Review">In Review</option>
              <option value="Done">Done</option>
            </select>
            <div className="h-4 w-[1px] bg-border/50" />
            <select 
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as Priority | "All")}
              className="bg-transparent text-[10px] font-black uppercase tracking-wider px-2 py-1.5 focus:outline-none cursor-pointer hover:text-primary transition-colors"
            >
              <option value="All">Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List Container */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 md:pr-2">
        <div className="flex flex-col gap-3">
          <AnimatePresence mode="popLayout">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task, index) => {
                const project = projects.find(p => p.id === task.projectId)
                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card 
                      onClick={() => handleTaskClick(task)}
                      className="group cursor-pointer bg-surface/30 border-border/50 backdrop-blur-md hover:bg-surface/50 hover:border-primary/30 transition-all duration-300"
                    >
                      <CardContent className="p-3 md:p-4 flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
                        <div className="flex items-center gap-3 md:gap-6 flex-1 min-w-0">
                          <div className="flex items-center justify-center h-10 w-10 shrink-0 rounded-xl bg-surface-hover/50 text-text-muted group-hover:text-primary group-hover:bg-primary/10 transition-all">
                            <ListTodo className="h-5 w-5" />
                          </div>

                          <div className="flex-1 flex flex-col gap-0.5 md:gap-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-text-muted/60">{task.id}</span>
                              <span className="hidden md:block h-1 w-1 rounded-full bg-text-disabled" />
                              <div className="flex items-center gap-1.5 text-[8px] md:text-[10px] font-bold text-text-muted uppercase">
                                <Calendar className="h-3 w-3" />
                                {task.dueDate || "No date"}
                              </div>
                              <span className="h-1 w-1 rounded-full bg-text-disabled" />
                              <div className="flex items-center gap-1.5 text-[8px] md:text-[10px] font-bold text-primary uppercase">
                                <div className={cn("h-1.5 w-1.5 rounded-full", project?.color)} />
                                <span className="truncate max-w-[80px] md:max-w-none">{project?.name || "Global"}</span>
                              </div>
                            </div>
                            <h3 className="font-bold text-foreground text-sm md:text-lg truncate group-hover:text-primary transition-colors">
                              {task.title}
                            </h3>
                          </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-3 md:gap-4 border-t md:border-t-0 border-border/30 pt-3 md:pt-0">
                          <div className="flex flex-col md:items-end gap-1">
                            <div className="flex items-center gap-2 text-[8px] md:text-[10px] font-bold text-text-muted uppercase tracking-tighter">
                              <User className="h-3 w-3" />
                              {task.assignee?.name || "Unassigned"}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 md:min-w-[200px] md:justify-end">
                            <Badge 
                              variant={
                                task.status === "Done" ? "success" : 
                                task.status === "In Progress" ? "info" : 
                                task.status === "In Review" ? "warning" : "secondary"
                              }
                              className="uppercase text-[8px] md:text-[10px] tracking-widest px-1.5 py-0.5"
                            >
                              {task.status}
                            </Badge>
                            <Badge 
                              variant={
                                task.priority === "Urgent" ? "danger" : 
                                task.priority === "High" ? "warning" : 
                                task.priority === "Medium" ? "primary" : "secondary"
                              }
                              className="uppercase text-[8px] md:text-[10px] tracking-widest px-1.5 py-0.5"
                            >
                              {task.priority}
                            </Badge>
                            <ChevronRight className="h-4 w-4 text-text-disabled group-hover:text-primary transition-colors ml-1 md:ml-2" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 md:py-20 text-center"
              >
                <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-surface-hover/50 flex items-center justify-center mb-4">
                  <Filter className="h-8 w-8 md:h-10 md:w-10 text-text-disabled" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-foreground">No tasks found</h3>
                <p className="text-xs md:text-sm text-text-muted max-w-xs mx-auto mt-2 font-medium">
                  We couldn&apos;t find any tasks matching your current criteria.
                </p>
                <button 
                  onClick={() => {
                    setSearchQuery("")
                    setStatusFilter("All")
                    setPriorityFilter("All")
                    setProjectFilter("All")
                  }}
                  className="mt-6 text-[10px] md:text-sm font-black uppercase tracking-widest text-primary hover:underline"
                >
                  Clear all filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {/* Details SlideOver */}
      <SlideOver
        isOpen={isDetailPanelOpen}
        onClose={() => setIsDetailPanelOpen(false)}
        title={activeDetailTask?.id || "Task Details"}
      >
        {activeDetailTask && (
          <TaskDetailPanel 
            task={activeDetailTask} 
            onClose={() => setIsDetailPanelOpen(false)}
          />
        )}
      </SlideOver>
    </div>
  )
}
