"use client"

import * as React from "react"
import { useBoard } from "@/context/BoardContext"
import { SubTask } from "@/types"
import { CheckCircle2, Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function SubTaskManager({ taskId, subTasks = [] }: { taskId: string; subTasks?: SubTask[] }) {
  const { toggleSubTask, addSubTask, removeSubTask } = useBoard()
  const [newSubTaskTitle, setNewSubTaskTitle] = React.useState("")

  const progress = subTasks.length > 0 
    ? Math.round((subTasks.filter(st => st.completed).length / subTasks.length) * 100) 
    : 0

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSubTaskTitle.trim()) return
    addSubTask(taskId, newSubTaskTitle)
    setNewSubTaskTitle("")
  }

  return (
    <div className="space-y-4">
      {/* Progress Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-black uppercase tracking-widest text-text-muted">Workflow Steps</h4>
        <span className="text-xs font-bold text-primary">{progress}% Complete</span>
      </div>
      
      <div className="h-2 w-full bg-surface rounded-full overflow-hidden">
        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      {/* Subtask List */}
      <div className="space-y-2">
        {subTasks.map((st) => (
          <div key={st.id} className="group flex items-center gap-3 p-3 rounded-xl bg-surface/30 border border-border/30 hover:border-primary/30 transition-colors">
            <button 
              onClick={() => toggleSubTask(taskId, st.id)}
              className={cn("h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all", st.completed ? "bg-success border-success" : "border-border")}
            >
              {st.completed && <CheckCircle2 className="h-3 w-3 text-background" />}
            </button>
            <span className={cn("text-xs font-medium flex-1", st.completed && "line-through text-text-disabled")}>
              {st.title}
            </span>
            <button 
              onClick={() => removeSubTask(taskId, st.id)}
              className="opacity-0 group-hover:opacity-100 p-1 hover:text-error transition-all"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Add New Subtask */}
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          value={newSubTaskTitle}
          onChange={(e) => setNewSubTaskTitle(e.target.value)}
          placeholder="Add actionable step..."
          className="flex-1 bg-surface border border-border/50 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary/50"
        />
        <button type="submit" className="p-2 rounded-xl bg-surface-hover hover:bg-primary hover:text-background transition-colors">
          <Plus className="h-4 w-4" />
        </button>
      </form>
    </div>
  )
}
