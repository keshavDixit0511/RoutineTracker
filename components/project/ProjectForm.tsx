"use client"

import * as React from "react"
import { Project } from "@/types"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

interface ProjectFormProps {
  onSubmit: (projectData: Omit<Project, "id">) => void
  onCancel: () => void
}

const PROJECT_COLORS = [
  { label: "Gold", value: "bg-primary" },
  { label: "Amber", value: "bg-gold" },
  { label: "Emerald", value: "bg-success" },
  { label: "Blue", value: "bg-info" },
  { label: "Rose", value: "bg-error" },
  { label: "Slate", value: "bg-text-disabled" },
]

export function ProjectForm({ onSubmit, onCancel }: ProjectFormProps) {
  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [color, setColor] = React.useState(PROJECT_COLORS[0].value)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    onSubmit({
      name,
      description,
      color,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className="space-y-6">
        {/* Name Field */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
            Project Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Q3 Roadmap"
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground transition-all duration-200 placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
            required
            autoFocus
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
            placeholder="What is this project about?"
            rows={3}
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground transition-all duration-200 custom-scrollbar placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
          />
        </div>

        {/* Color Picker */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
            Theme Color
          </label>
          <div className="flex flex-wrap gap-3">
            {PROJECT_COLORS.map((pc) => (
              <button
                key={pc.value}
                type="button"
                onClick={() => setColor(pc.value)}
                className={cn(
                  "h-8 w-8 rounded-full border-4 transition-all hover:scale-110 active:scale-95",
                  pc.value,
                  color === pc.value ? "border-foreground shadow-lg" : "border-transparent"
                )}
                title={pc.label}
              />
            ))}
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
          Create Project
        </Button>
      </div>
    </form>
  )
}
