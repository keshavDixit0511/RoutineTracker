"use client"

import * as React from "react"
import { useBoard } from "@/context/BoardContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { CheckCircle2, ListTodo, AlertCircle, Clock } from "lucide-react"

export function DashboardView() {
  const { boardData } = useBoard()
  
  if (!boardData) return null

  const { activeProjectId, projects = [], tasks: allTasksMap = {} } = boardData
  
  const activeProject = projects.find(p => p.id === activeProjectId)
  const tasks = Object.values(allTasksMap).filter(t => t.projectId === activeProjectId)
  
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.status === "Done").length
  const inProgressTasks = tasks.filter(t => t.status === "In Progress").length
  const urgentTasks = tasks.filter(t => t.priority === "Urgent" && t.status !== "Done").length

  return (
    <div className="p-4 md:p-10 flex flex-col gap-6 md:gap-10 w-full max-w-7xl mx-auto custom-scrollbar overflow-y-auto h-full">
      {/* Header Section */}
      <div className="space-y-2">
        <h2 className="text-2xl md:text-4xl font-black text-foreground tracking-tighter uppercase italic">
          {activeProject?.name || "Dashboard"} <span className="text-primary not-italic tracking-normal">Overview</span>
        </h2>
        <p className="text-xs md:text-sm text-text-muted font-medium">Real-time intelligence and project velocity metrics.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="bg-surface/30 border-border/50 backdrop-blur-md shadow-sm transition-all hover:shadow-lg hover:border-primary/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2 md:pb-3">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Total Tasks</CardTitle>
            <div className="p-2 rounded-lg bg-surface-hover/50 text-text-muted">
              <ListTodo className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-black text-foreground tracking-tight">{totalTasks}</div>
            <div className="mt-1 md:mt-2 text-[10px] md:text-xs font-bold text-text-muted uppercase">Global Pool</div>
          </CardContent>
        </Card>

        <Card className="bg-surface/30 border-border/50 backdrop-blur-md shadow-sm transition-all hover:shadow-lg hover:border-info/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2 md:pb-3">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">In Progress</CardTitle>
            <div className="p-2 rounded-lg bg-info/10 text-info">
              <Clock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-black text-foreground tracking-tight">{inProgressTasks}</div>
            <div className="mt-1 md:mt-2 text-[10px] md:text-xs font-bold text-info/80 uppercase">Active Cycles</div>
          </CardContent>
        </Card>

        <Card className="bg-surface/30 border-border/50 backdrop-blur-md shadow-sm transition-all hover:shadow-lg hover:border-success/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2 md:pb-3">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Completed</CardTitle>
            <div className="p-2 rounded-lg bg-success/10 text-success">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-black text-foreground tracking-tight">{completedTasks}</div>
            <div className="mt-1 md:mt-2 text-[10px] md:text-xs font-bold text-success/80 uppercase">Finalized Units</div>
          </CardContent>
        </Card>

        <Card className="bg-error/5 border-error/20 backdrop-blur-md shadow-sm transition-all hover:shadow-lg hover:border-error/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2 md:pb-3">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-error">Urgent Action</CardTitle>
            <div className="p-2 rounded-lg bg-error/10 text-error">
              <AlertCircle className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-black text-error tracking-tight">{urgentTasks}</div>
            <div className="mt-1 md:mt-2 text-[10px] md:text-xs font-bold text-error/80 uppercase">High Latency Risk</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
         {/* Priority Breakdown */}
         <Card className="bg-surface/30 border-border/50 backdrop-blur-md col-span-1 rounded-2xl">
          <CardHeader className="border-b border-border/30 mb-2 md:mb-4 pb-4 md:pb-6">
            <CardTitle className="text-base md:text-lg font-bold">Priority Allocation</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 md:gap-6 pt-2">
             {["Urgent", "High", "Medium", "Low"].map(priority => {
               const count = tasks.filter(t => t.priority === priority).length
               const percentage = totalTasks > 0 ? (count / totalTasks) * 100 : 0
               return (
                 <div key={priority} className="flex flex-col gap-2 md:gap-3">
                   <div className="flex justify-between items-end">
                     <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted/80">{priority}</span>
                     <span className="text-xs md:text-sm font-black text-foreground">{count}</span>
                   </div>
                   <div className="h-2 md:h-3 w-full bg-surface-hover/30 rounded-full p-[2px] border border-border/50">
                     <div 
                       className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm ${
                         priority === "Urgent" ? "bg-gold" : 
                         priority === "High" ? "bg-error" : 
                         priority === "Medium" ? "bg-primary" : "bg-text-disabled"
                       }`} 
                       style={{ width: `${percentage}%` }}
                     />
                   </div>
                 </div>
               )
             })}
          </CardContent>
         </Card>

         {/* Recent Tasks */}
         <Card className="bg-surface/30 border-border/50 backdrop-blur-md col-span-1 lg:col-span-2 rounded-2xl">
          <CardHeader className="border-b border-border/30 mb-2 md:mb-4 pb-4 md:pb-6">
            <CardTitle className="text-base md:text-lg font-bold">In-Flight Operations</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 md:gap-4 pt-2">
             {tasks.filter(t => t.status !== "Done").slice(0, 5).map(task => (
               <div key={task.id} className="group flex items-center justify-between p-3 md:p-4 rounded-xl border border-border/50 bg-surface/20 hover:bg-surface/50 hover:border-primary/30 transition-all duration-300">
                 <div className="flex flex-col gap-0.5 md:gap-1">
                   <span className="font-bold text-foreground text-sm md:text-[15px] group-hover:text-primary transition-colors">{task.title}</span>
                   <div className="flex items-center gap-2">
                     <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-text-muted/60">{task.id}</span>
                     <span className="h-0.5 w-0.5 md:h-1 md:w-1 rounded-full bg-text-disabled" />
                     <span className="text-[8px] md:text-[10px] font-bold text-text-muted uppercase tracking-tight">{task.status}</span>
                   </div>
                 </div>
                 <div className={`text-[8px] md:text-[10px] font-black px-2 md:px-3 py-0.5 md:py-1 rounded-lg uppercase tracking-tighter border ${
                   task.priority === "Urgent" ? "bg-gold/10 text-gold border-gold/30" :
                   "bg-surface-hover/50 text-text-muted border-border/50"
                 }`}>
                   {task.priority}
                 </div>
               </div>
             ))}
             {tasks.filter(t => t.status !== "Done").length === 0 && (
               <div className="text-center py-8 md:py-12 text-text-muted font-medium italic text-sm">Operational silence. All units clear.</div>
             )}
          </CardContent>
         </Card>
      </div>
    </div>
  )
}
