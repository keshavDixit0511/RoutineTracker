"use client"

import * as React from "react"
import { Priority, Status, Task } from "@/types"
import { Button } from "@/components/ui/Button"

interface TaskFormProps {
  initialData?: Task
  defaultStatus?: Status
  onSubmit: (taskData: Partial<Task>) => void
  onCancel: () => void
}

export function TaskForm({ initialData, defaultStatus = "Todo", onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = React.useState(initialData?.title || "")
  const [description, setDescription] = React.useState(initialData?.description || "")
  const [priority, setPriority] = React.useState<Priority>(initialData?.priority || "Medium")
  const [status, setStatus] = React.useState<Status>(initialData?.status || defaultStatus)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    onSubmit({
      title,
      description,
      priority,
      status
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className="space-y-6">
        {/* Title Field */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
            Task Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Redesign landing page"
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground transition-all duration-200 placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
            required
          />
        </div>

        {/* Description Field */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more details..."
            rows={4}
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground transition-all duration-200 custom-scrollbar placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
          />
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Priority
            </label>
            <div className="relative">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full appearance-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none cursor-pointer"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-muted">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Status
            </label>
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                className="w-full appearance-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none cursor-pointer"
              >
                <option value="Todo">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="In Review">In Review</option>
                <option value="Done">Done</option>
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-muted">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center gap-4 pt-4">
        <Button 
          type="button" 
          variant="secondary" 
          className="flex-1 h-12 rounded-xl font-bold transition-all hover:bg-surface-hover" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="default" 
          className="flex-1 h-12 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
        >
          {initialData ? "Save Changes" : "Create Task"}
        </Button>
      </div>
    </form>
  )
}
