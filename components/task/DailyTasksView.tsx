"use client"

import * as React from "react"
import { useBoard } from "@/context/BoardContext"
import { Badge } from "@/components/ui/Badge"
import { CheckCircle2, Plus, Info } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { format, addDays, startOfDay, isBefore, isAfter, isSameDay } from "date-fns"
import { HabitRoutineSection } from "./HabitRoutineSection"

export function DailyTasksView() {
  const { boardData, addDailyTask, toggleDailyTask } = useBoard()
  const [selectedDate, setSelectedDate] = React.useState(startOfDay(new Date()))
  const [newTaskTitle, setNewTaskTitle] = React.useState("")
  
  if (!boardData) return null

  const { tasks } = boardData
  const dateStr = format(selectedDate, "yyyy-MM-dd")
  const dailyTasks = Object.values(tasks).filter(t => t.dailyDate === dateStr)
  
  const isPast = isBefore(selectedDate, startOfDay(new Date()))
  const isTooFarFuture = isAfter(selectedDate, addDays(startOfDay(new Date()), 30))
  const canAddTask = !isPast && !isTooFarFuture

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim() || !canAddTask) return
    
    addDailyTask({
      title: newTaskTitle,
      priority: "Medium",
    }, dateStr)
    setNewTaskTitle("")
  }

  const dates = Array.from({ length: 45 }).map((_, i) => addDays(startOfDay(new Date()), i - 7))

  const getDateStatus = (date: Date) => {
    const dStr = format(date, "yyyy-MM-dd")
    const tasksForDate = Object.values(tasks).filter(t => t.dailyDate === dStr)
    if (tasksForDate.length === 0) return "none"
    const allDone = tasksForDate.every(t => t.status === "Done")
    return allDone ? "completed" : "pending"
  }

  return (
    <div className="p-4 md:p-10 flex flex-col gap-6 md:gap-8 w-full max-w-7xl mx-auto h-full overflow-hidden">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
        <div className="space-y-1 md:space-y-2">
          <h2 className="text-2xl md:text-4xl font-black text-foreground tracking-tighter uppercase italic">
            Daily <span className="text-primary not-italic tracking-normal">Routine</span>
          </h2>
          <p className="text-xs md:text-sm text-text-muted font-medium">Manage your time with surgical precision.</p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant={isPast || isTooFarFuture ? "secondary" : "gold"}>
            {dailyTasks.length} Tasks
          </Badge>
        </div>
      </div>

      {/* Date Navigation Strip */}
      <div className="flex items-center gap-3 md:gap-4 overflow-x-auto pb-4 custom-scrollbar no-scrollbar">
        {dates.map((date) => {
          const status = getDateStatus(date)
          const isSelected = isSameDay(date, selectedDate)
          return (
            <button
              key={date.toISOString()}
              onClick={() => setSelectedDate(date)}
              className={cn(
                "flex flex-col items-center min-w-[60px] md:min-w-[70px] p-2 md:p-3 rounded-xl md:rounded-2xl border transition-all duration-300",
                isSelected 
                  ? "bg-primary border-primary text-background shadow-lg shadow-primary/20 scale-105" 
                  : "bg-surface/30 border-border/50 text-text-muted hover:border-primary/30",
                status === "completed" && !isSelected && "border-success/50",
                status === "pending" && !isSelected && "border-error/50"
              )}
            >
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-0.5 md:mb-1 opacity-70">
                {format(date, "EEE")}
              </span>
              <span className="text-lg md:text-xl font-black tracking-tighter">
                {format(date, "d")}
              </span>
            </button>
          )
        })}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-8 md:space-y-10">
        <div className="flex flex-col gap-4 md:gap-6">
           <div className="flex items-center justify-between">
             <h3 className="font-bold text-lg md:text-xl">{format(selectedDate, "MMMM d, yyyy")}</h3>
             <p className="text-[10px] md:text-xs text-text-muted font-medium uppercase tracking-wider">
               {isPast ? "Archive" : isTooFarFuture ? "Future" : "Active"}
             </p>
           </div>

           {canAddTask ? (
             <form onSubmit={handleAddTask} className="relative group">
                <Plus className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted group-focus-within:text-primary transition-colors" />
                <input 
                  type="text"
                  placeholder="Add a precision task..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 md:py-4 bg-surface/30 border border-border/50 rounded-xl md:rounded-2xl text-sm md:text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all placeholder:text-text-disabled"
                />
             </form>
           ) : (
             <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-info/5 border border-info/20 flex items-center gap-3 text-info">
               <Info className="h-4 w-4 md:h-5 md:w-5 shrink-0" />
               <p className="text-xs md:text-sm font-medium">
                 {isPast ? "This date is in the past. Tasks are read-only." : "Limited to next 30 days."}
               </p>
             </div>
           )}

           <div className="space-y-2 md:space-y-3">
              <AnimatePresence mode="popLayout">
                {dailyTasks.length > 0 ? (
                  dailyTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={cn(
                        "group flex items-center justify-between p-3 md:p-4 rounded-xl md:rounded-2xl border transition-all duration-300 bg-surface/20",
                        task.status === "Done" ? "border-success/20 opacity-60" : "border-border/50 hover:border-primary/30"
                      )}
                    >
                      <div className="flex items-center gap-3 md:gap-4">
                        <button
                          onClick={() => toggleDailyTask(task.id)}
                          className={cn(
                            "h-5 w-5 md:h-6 md:w-6 rounded-full border-2 flex items-center justify-center transition-all",
                            task.status === "Done" ? "bg-success border-success text-background" : "border-border hover:border-primary"
                          )}
                        >
                          {task.status === "Done" && <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4" />}
                        </button>
                        <span className={cn(
                          "font-bold text-sm md:text-[15px] transition-all",
                          task.status === "Done" ? "text-text-disabled line-through" : "text-foreground"
                        )}>
                          {task.title}
                        </span>
                      </div>
                      <div className="hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity">
                          <Badge variant="outline">{task.id}</Badge>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-8 md:py-10 text-center opacity-40 italic text-sm">
                    <p>No tasks assigned to this cycle.</p>
                  </div>
                )}
              </AnimatePresence>
           </div>
        </div>

        <HabitRoutineSection selectedDate={selectedDate} />
      </div>
    </div>
  )
}
