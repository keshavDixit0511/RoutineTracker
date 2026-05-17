"use client"

import * as React from "react"
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core"
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { Status, Task } from "@/types"
import { KanbanColumn } from "./KanbanColumn"
import { TaskCard } from "./TaskCard"
import { TaskDetailPanel } from "@/components/task/TaskDetailPanel"
import { TaskForm } from "@/components/task/TaskForm"
import { SlideOver } from "@/components/ui/SlideOver"
import { useBoard } from "@/context/BoardContext"

export function KanbanBoard() {
  const { boardData, setBoardData, addTask } = useBoard()

  const [activeTask, setActiveTask] = React.useState<Task | null>(null)
  
  // Selected task state for details panel
  const [selectedTaskId, setSelectedTaskId] = React.useState<string | null>(null)
  const [isDetailPanelOpen, setIsDetailPanelOpen] = React.useState(false)

  // Add task state
  const [isAddPanelOpen, setIsAddPanelOpen] = React.useState(false)
  const [addPanelStatus, setAddPanelStatus] = React.useState<Status>("Todo")

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  if (!boardData) return null

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const taskId = active.id as string
    setActiveTask(boardData.tasks[taskId])
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Find columns
    const activeColumnId = Object.values(boardData.columns).find(col => col.taskIds.includes(activeId))?.id
    const overColumnId = Object.values(boardData.columns).find(col => col.taskIds.includes(overId))?.id || overId

    if (!activeColumnId || !overColumnId || activeColumnId === overColumnId) {
      return
    }

    setBoardData((prev) => {
      const activeTaskIds = [...prev.columns[activeColumnId].taskIds]
      const overTaskIds = [...(prev.columns[overColumnId as Status]?.taskIds || [])]

      const activeIndex = activeTaskIds.indexOf(activeId)
      const overIndex = overId in prev.tasks ? overTaskIds.indexOf(overId) : overTaskIds.length

      activeTaskIds.splice(activeIndex, 1)
      overTaskIds.splice(overIndex, 0, activeId)

      return {
        ...prev,
        columns: {
          ...prev.columns,
          [activeColumnId]: { ...prev.columns[activeColumnId], taskIds: activeTaskIds },
          [overColumnId]: { ...prev.columns[overColumnId as Status], taskIds: overTaskIds },
        },
        tasks: {
          ...prev.tasks,
          [activeId]: { ...prev.tasks[activeId], status: overColumnId as Status }
        }
      }
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null)
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const columnId = Object.values(boardData.columns).find(col => col.taskIds.includes(activeId))?.id
    if (!columnId) return

    const columnTaskIds = boardData.columns[columnId].taskIds
    const activeIndex = columnTaskIds.indexOf(activeId)
    const overIndex = columnTaskIds.indexOf(overId)

    if (activeIndex !== overIndex) {
      setBoardData((prev) => ({
        ...prev,
        columns: {
          ...prev.columns,
          [columnId]: {
            ...prev.columns[columnId],
            taskIds: arrayMove(columnTaskIds, activeIndex, overIndex),
          },
        },
      }))
    }
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTaskId(task.id)
    setIsDetailPanelOpen(true)
  }

  const handleAddClick = (status: Status) => {
    setAddPanelStatus(status)
    setIsAddPanelOpen(true)
  }

  const handleAddTaskSubmit = (taskData: Partial<Task>) => {
    addTask(taskData as Omit<Task, "id">, addPanelStatus)
    setIsAddPanelOpen(false)
  }

  const activeDetailTask = selectedTaskId ? boardData.tasks[selectedTaskId] : null

  return (
    <>
      <div className="flex h-full w-full gap-6 p-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {boardData.columnOrder.map((columnId) => {
            const column = boardData.columns[columnId]
            const tasks = column.taskIds
              .map((taskId) => boardData.tasks[taskId])
              .filter((task) => task.projectId === boardData.activeProjectId)
            
            return (
              <KanbanColumn
                key={column.id}
                column={column}
                tasks={tasks}
                onTaskClick={handleTaskClick}
                onAddClick={handleAddClick}
              />
            )
          })}
          
          <DragOverlay>
            {activeTask ? <TaskCard task={activeTask} onClick={() => {}} /> : null}
          </DragOverlay>
        </DndContext>
      </div>

      <SlideOver
        isOpen={isDetailPanelOpen}
        onClose={() => setIsDetailPanelOpen(false)}
        title={activeDetailTask?.id || "Task Details"}
      >
        {activeDetailTask && (
          <TaskDetailPanel 
            task={activeDetailTask} 
            onClose={() => setIsDetailPanelOpen(false)}
          />
        )}
      </SlideOver>

      <SlideOver
        isOpen={isAddPanelOpen}
        onClose={() => setIsAddPanelOpen(false)}
        title="Create New Task"
      >
        <div className="pt-2">
          <TaskForm 
            defaultStatus={addPanelStatus}
            onSubmit={handleAddTaskSubmit} 
            onCancel={() => setIsAddPanelOpen(false)} 
          />
        </div>
      </SlideOver>
    </>
  )
}
