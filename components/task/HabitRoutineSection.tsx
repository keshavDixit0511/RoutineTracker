"use client"

import * as React from "react"
import { useBoard } from "@/context/BoardContext"
import { Card } from "@/components/ui/Card"
import { CheckCircle2, Circle, Sun, Moon, Plus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

export function HabitRoutineSection({ selectedDate }: { selectedDate: Date }) {
  const { boardData, toggleHabit, toggleRoutineTask, addRoutineTask } = useBoard()
  
  if (!boardData) return null

  const { habits, routines } = boardData
  const dateStr = format(selectedDate, "yyyy-MM-dd")

  const handleAddRoutine = (type: "morning" | "night") => {
    const title = prompt(`Enter new task for ${type} routine:`)
    if (title) addRoutineTask(type, title)
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Habits Section */}
      <div className="space-y-4">
        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-text-muted flex items-center justify-between">
          Habits
          <button className="text-primary hover:text-foreground"><Plus className="h-4 w-4" /></button>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <AnimatePresence>
            {habits.map((habit) => {
              const isCompleted = habit.completedDates.includes(dateStr)
              return (
                <motion.div key={habit.id} layout>
                  <Card 
                    className={cn(
                      "cursor-pointer p-4 border transition-all hover:border-primary/50",
                      isCompleted ? "bg-surface/50 border-success/20" : "bg-surface/30 border-border/50"
                    )}
                    onClick={() => toggleHabit(habit.id, dateStr)}
                  >
                    <div className="flex items-center justify-between">
                       <span className={cn("font-bold text-sm", isCompleted ? "text-success" : "text-foreground")}>
                         {habit.title}
                       </span>
                       {isCompleted ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Circle className="h-4 w-4 text-border" />}
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Routines Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {(["morning", "night"] as const).map(type => (
          <div key={type} className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-text-muted flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                {type === "morning" ? <Sun className="h-4 w-4 text-gold" /> : <Moon className="h-4 w-4 text-info" />}
                {type} Routine
              </div>
              <button 
                onClick={() => handleAddRoutine(type)}
                className="text-text-muted hover:text-primary transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </h4>
            <div className="space-y-2">
              {routines[type].tasks.map(task => (
                <div 
                  key={task.id} 
                  className="flex items-center gap-3 p-3 rounded-xl bg-surface/30 border border-border/30 cursor-pointer hover:border-primary/30"
                  onClick={() => toggleRoutineTask(type, task.id)}
                >
                  <div className={cn("h-4 w-4 rounded-full border flex items-center justify-center", task.completed ? "bg-success border-success" : "border-border")}>
                    {task.completed && <CheckCircle2 className="h-3 w-3 text-background" />}
                  </div>
                  <span className={cn("text-xs font-medium", task.completed ? "text-text-disabled line-through" : "text-foreground")}>
                    {task.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
