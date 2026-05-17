"use client"

import * as React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Task } from "@/types"
import { Calendar, CheckSquare, MessageSquare } from "lucide-react"

interface TaskCardProps {
  task: Task
  onClick: (task: Task) => void
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { type: "Task", task } })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="h-32 w-full rounded-lg border-2 border-primary border-dashed bg-primary/5 opacity-50"
      />
    )
  }

  const getPriorityBadge = (priority: Task["priority"]) => {
    switch (priority) {
      case "Urgent": return <Badge variant="gold">Urgent</Badge>
      case "High": return <Badge variant="danger">High</Badge>
      case "Medium": return <Badge variant="outline">Medium</Badge>
      case "Low": return <Badge variant="secondary">Low</Badge>
      default: return null
    }
  }

  const completedSubtasks = task.subTasks?.filter((t) => t.completed).length || 0
  const totalSubtasks = task.subTasks?.length || 0

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onClick(task)}
      className="group relative cursor-grab active:cursor-grabbing border-border/50 bg-surface/40 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 active:scale-100"
    >
      <CardContent className="p-5 flex flex-col gap-4">
        {/* Task ID & Priority */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted/60">
            {task.id}
          </span>
          {getPriorityBadge(task.priority)}
        </div>

        {/* Title */}
        <p className="font-semibold text-[15px] text-foreground leading-tight group-hover:text-primary transition-colors">
          {task.title}
        </p>

        {/* Footer Meta */}
        <div className="flex items-center justify-between border-t border-border/50 pt-4 mt-1">
          <div className="flex items-center gap-4 text-text-muted">
            {totalSubtasks > 0 && (
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <CheckSquare className="h-4 w-4 text-primary/70" />
                <span className="text-foreground/80">{completedSubtasks}/{totalSubtasks}</span>
              </div>
            )}
            {task.dueDate && (
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <Calendar className="h-4 w-4 text-text-muted/70" />
                <span className="text-foreground/80">{task.dueDate}</span>
              </div>
            )}
          </div>
          
          {task.assignee && (
            <div className="group/avatar relative h-7 w-7 ring-2 ring-background transition-transform hover:scale-110">
              <div className="h-full w-full overflow-hidden rounded-full border border-border/50 bg-surface shadow-sm">
                <img
                  src={task.assignee.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${task.assignee.name}&backgroundColor=e2e8f0`}
                  alt={task.assignee.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-foreground px-2 py-1 text-[10px] font-bold text-background opacity-0 transition-opacity group-hover/avatar:opacity-100 pointer-events-none whitespace-nowrap">
                {task.assignee.name}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
