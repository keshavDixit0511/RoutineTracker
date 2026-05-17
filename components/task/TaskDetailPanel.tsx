"use client"

import * as React from "react"
import { Task } from "@/types"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Clock, Trash2, User, X } from "lucide-react"
import { useBoard } from "@/context/BoardContext"
import { TaskForm } from "./TaskForm"
import { SubTaskManager } from "./SubTaskManager"

interface TaskDetailPanelProps {
  task: Task
  onClose: () => void
}

export function TaskDetailPanel({ task, onClose }: TaskDetailPanelProps) {
  const { updateTask, deleteTask } = useBoard()
  const [isEditing, setIsEditing] = React.useState(false)

  const handleMarkDone = () => {
    updateTask(task.id, { status: "Done" })
    onClose()
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteTask(task.id)
      onClose()
    }
  }

  const handleEditSubmit = (updates: Partial<Task>) => {
    updateTask(task.id, updates)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="pt-2">
        <TaskForm
          initialData={task}
          onSubmit={handleEditSubmit}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold text-foreground leading-tight">
          {task.title}
        </h1>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant={task.priority === "Urgent" ? "gold" : task.priority === "High" ? "danger" : "secondary"}>
              {task.priority} Priority
            </Badge>
            <Badge variant="outline">{task.status}</Badge>
          </div>
          <button 
            onClick={handleDelete}
            className="text-text-muted hover:text-error transition-colors"
            title="Delete Task"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Meta Properties */}
      <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <User className="h-4 w-4" />
            <span>Assignee</span>
          </div>
          <div className="flex items-center gap-2">
            {task.assignee ? (
              <>
                <div className="h-6 w-6 overflow-hidden rounded-full bg-primary/20">
                   <img src={task.assignee.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${task.assignee.name}`} alt="" className="h-full w-full object-cover"/>
                </div>
                <span className="text-sm font-medium text-foreground">{task.assignee.name}</span>
              </>
            ) : (
              <span className="text-sm text-text-muted">Unassigned</span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <Clock className="h-4 w-4" />
            <span>Due Date</span>
          </div>
          <span className="text-sm font-medium text-foreground">{task.dueDate || "None"}</span>
        </div>
      </div>

      {/* Description Section */}
      <div className="flex flex-col gap-2">
        <h3 className="font-medium text-foreground">Description</h3>
        <p className="text-sm text-text-muted leading-relaxed">
          {task.description || "No description provided. Add one to give more context about this task."}
        </p>
      </div>

      {/* Subtasks Section */}
      <SubTaskManager taskId={task.id} subTasks={task.subTasks} />

      {/* Actions */}
      <div className="mt-4 flex gap-3">
        {task.status !== "Done" && (
          <Button onClick={handleMarkDone} className="flex-1">Mark as Done</Button>
        )}
        <Button onClick={() => setIsEditing(true)} variant="outline" className="flex-1">Edit Task</Button>
      </div>
    </div>
  )
}
