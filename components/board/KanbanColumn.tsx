"use client"

import * as React from "react"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Column, Status, Task } from "@/types"
import { TaskCard } from "./TaskCard"
import { Plus } from "lucide-react"

interface KanbanColumnProps {
  column: Column
  tasks: Task[]
  onTaskClick: (task: Task) => void
  onAddClick: (status: Status) => void
}

export function KanbanColumn({ column, tasks, onTaskClick, onAddClick }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  })

  return (
    <div className="flex h-full w-[280px] min-w-[280px] md:w-[340px] md:min-w-[340px] flex-col rounded-2xl bg-surface/30 border border-border/50 p-4 md:p-5 shadow-sm backdrop-blur-sm">
      {/* Column Header */}
      <div className="mb-4 md:mb-6 flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/90">
            {column.title}
          </h3>
          <span className="flex h-6 min-w-6 items-center justify-center rounded-lg bg-primary/10 px-1.5 text-[10px] font-black text-primary border border-primary/20">
            {tasks.length}
          </span>
        </div>
        <button 
          onClick={() => onAddClick(column.id)}
          className="group/add flex h-8 w-8 items-center justify-center rounded-xl bg-surface-hover/50 text-text-muted hover:bg-primary hover:text-white transition-all duration-300 shadow-sm"
        >
          <Plus className="h-4 w-4 transition-transform group-hover/add:rotate-90" />
        </button>
      </div>

      {/* Task List Container */}
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto custom-scrollbar pr-1.5 pb-6">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <div ref={setNodeRef} className="flex min-h-[200px] flex-col gap-4">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onClick={onTaskClick} />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  )
}
