"use client"

import * as React from "react"
import { useBoard } from "@/context/BoardContext"
import { Card } from "@/components/ui/Card"
import { CheckCircle2, Circle, Sun, Moon, Plus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { SlideOver } from "@/components/ui/SlideOver"
import { Button } from "@/components/ui/Button"

export function HabitRoutineSection({ selectedDate }: { selectedDate: Date }) {
  const { boardData, toggleHabit, toggleRoutineTask, addRoutineTask, addHabit } = useBoard()
  const [activeModal, setActiveModal] = React.useState<"habit" | "morning" | "night" | null>(null)
  const [titleInput, setTitleInput] = React.useState("")
  
  if (!boardData) return null

  const { habits, routines } = boardData
  const dateStr = format(selectedDate, "yyyy-MM-dd")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!titleInput.trim()) return

    if (activeModal === "habit") {
      addHabit({
        title: titleInput,
        color: "bg-primary",
        frequency: "daily"
      })
    } else if (activeModal === "morning" || activeModal === "night") {
      addRoutineTask(activeModal, titleInput)
    }

    setTitleInput("")
    setActiveModal(null)
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Habits Section */}
      <div className="space-y-4">
        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-text-muted flex items-center justify-between">
          Habits
          <button 
            onClick={() => setActiveModal("habit")}
            className="text-primary hover:text-foreground transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <AnimatePresence>
            {habits.map((habit) => {
              const isCompleted = habit.completedDates.includes(dateStr)
              return (
                <motion.div 
                  key={habit.id} 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
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
                onClick={() => setActiveModal(type)}
                className="text-text-muted hover:text-primary transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </h4>
            <div className="space-y-2">
              <AnimatePresence>
                {routines[type].tasks.map(task => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-surface/30 border border-border/30 cursor-pointer hover:border-primary/30"
                    onClick={() => toggleRoutineTask(type, task.id)}
                  >
                    <div className={cn("h-4 w-4 rounded-full border flex items-center justify-center", task.completed ? "bg-success border-success" : "border-border")}>
                      {task.completed && <CheckCircle2 className="h-3 w-3 text-background" />}
                    </div>
                    <span className={cn("text-xs font-medium", task.completed ? "text-text-disabled line-through" : "text-foreground")}>
                      {task.title}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      <SlideOver
        isOpen={activeModal !== null}
        onClose={() => setActiveModal(null)}
        title={
          activeModal === "habit" 
            ? "Create New Habit" 
            : `Add to ${activeModal?.charAt(0).toUpperCase()}${activeModal?.slice(1)} Routine`
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-text-muted">
              {activeModal === "habit" ? "Habit Title" : "Task Title"}
            </label>
            <input
              autoFocus
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              placeholder={activeModal === "habit" ? "e.g. Morning Yoga" : "e.g. Drink glass of water"}
              className="w-full bg-surface border border-border rounded-xl p-4 text-foreground focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          {activeModal === "habit" && (
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
              <p className="text-xs text-text-muted leading-relaxed">
                Habits are recurring tasks you want to track daily. They will appear in your daily view and contribute to your performance metrics.
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="secondary" 
              className="flex-1"
              onClick={() => setActiveModal(null)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={!titleInput.trim()}
            >
              Create
            </Button>
          </div>
        </form>
      </SlideOver>
    </div>
  )
}
