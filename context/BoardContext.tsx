"use client"

import * as React from "react"
import { BoardData, Status, Task, Project, SubTask, RoutineTask, FocusSession, Habit } from "@/types"

// Initial Seed Data
const initialData: BoardData = {
  tasks: {
    "T-101": { id: "T-101", title: "Design the new branding assets", status: "Todo", priority: "High", projectId: "p3", assignee: { name: "Alice" }, dueDate: "May 10", subTasks: [{ id: "st1", title: "Logo", completed: true }, { id: "st2", title: "Color Palette", completed: false }] },
    "T-102": { id: "T-102", title: "Update the marketing website", status: "Todo", priority: "Medium", projectId: "p1" },
    "T-103": { id: "T-103", title: "Fix production payment bug", status: "In Progress", priority: "Urgent", projectId: "p2", assignee: { name: "Bob", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Bob&backgroundColor=ffdfbf" } },
    "T-104": { id: "T-104", title: "Write API documentation", status: "In Review", priority: "Low", projectId: "p1" },
    "T-105": { id: "T-105", title: "Setup CI/CD pipeline", status: "Done", priority: "Medium", projectId: "p2", assignee: { name: "Charlie" }, completedAt: new Date().toISOString() },
  },
  columns: {
    "Todo": { id: "Todo", title: "To Do", taskIds: ["T-101", "T-102"] },
    "In Progress": { id: "In Progress", title: "In Progress", taskIds: ["T-103"] },
    "In Review": { id: "In Review", title: "In Review", taskIds: ["T-104"] },
    "Done": { id: "Done", title: "Done", taskIds: ["T-105"] },
  },
  columnOrder: ["Todo", "In Progress", "In Review", "Done"],
  team: [
    { 
      id: "u1", 
      name: "Alice", 
      role: "Senior Designer", 
      email: "alice@routinetrack.com",
      avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Alice&backgroundColor=c0aede",
      bio: "Focusing on high-fidelity UI/UX and brand consistency."
    },
    { 
      id: "u2", 
      name: "Bob", 
      role: "Lead Developer", 
      email: "bob@routinetrack.com",
      avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Bob&backgroundColor=ffdfbf",
      bio: "Architecting scalable solutions and maintaining technical excellence."
    },
    { 
      id: "u3", 
      name: "Charlie", 
      role: "DevOps Engineer", 
      email: "charlie@routinetrack.com",
      avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Charlie&backgroundColor=d1d4f9",
      bio: "Streamlining deployment pipelines and ensuring system reliability."
    },
    { 
      id: "u4", 
      name: "Diana", 
      role: "Product Manager", 
      email: "diana@routinetrack.com",
      avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Diana&backgroundColor=ffd5dc",
      bio: "Bridging the gap between user needs and technical implementation."
    }
  ],
  projects: [
    { id: "p1", name: "Website Redesign", color: "bg-primary" },
    { id: "p2", name: "Mobile App Launch", color: "bg-gold" },
    { id: "p3", name: "Brand Assets", color: "bg-success" },
  ],
  activeProjectId: "p1",
  habits: [
    { id: "h1", title: "Morning Meditation", color: "bg-primary", frequency: "daily", completedDates: [], streak: 0, longestStreak: 0, createdAt: new Date().toISOString() },
    { id: "h2", title: "Drink 2L Water", color: "bg-info", frequency: "daily", completedDates: [], streak: 0, longestStreak: 0, createdAt: new Date().toISOString() },
  ],
  routines: {
    morning: { id: "mr1", type: "morning", tasks: [{ id: "rt1", title: "Make bed", completed: false }, { id: "rt2", title: "Coffee", completed: false }] },
    night: { id: "nr1", type: "night", tasks: [{ id: "rt3", title: "Read book", completed: false }, { id: "rt4", title: "Prepare clothes", completed: false }] }
  },
  focusSessions: []
}

interface BoardContextProps {
  boardData: BoardData
  setBoardData: React.Dispatch<React.SetStateAction<BoardData>>
  addTask: (task: Omit<Task, "id" | "status" | "projectId">, columnId: Status) => void
  updateTask: (taskId: string, updates: Partial<Task>) => void
  toggleSubTask: (taskId: string, subTaskId: string) => void
  removeSubTask: (taskId: string, subTaskId: string) => void
  addSubTask: (taskId: string, title: string) => void
  deleteTask: (taskId: string) => void
  setActiveProjectId: (projectId: string) => void
  addProject: (project: Omit<Project, "id">) => void
  addHabit: (habit: Omit<Habit, "id" | "completedDates" | "streak" | "longestStreak" | "createdAt">) => void
  addDailyTask: (task: Omit<Task, "id" | "status" | "projectId">, date: string) => void
  toggleDailyTask: (taskId: string) => void
  toggleHabit: (habitId: string, date: string) => void
  toggleRoutineTask: (type: "morning" | "night", taskId: string) => void
  addRoutineTask: (type: "morning" | "night", title: string) => void
  addFocusSession: (session: Omit<FocusSession, "id" | "date">) => void
}

const BoardContext = React.createContext<BoardContextProps | undefined>(undefined)

export function BoardProvider({ children }: { children: React.ReactNode }) {
  const [boardData, setBoardData] = React.useState<BoardData>(initialData)
  const [isMounted, setIsMounted] = React.useState(false)

  // Mark as mounted
  React.useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0)
    return () => clearTimeout(timer)
  }, [])

  // Load from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem("routineTrackBoard")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Ensure habits and routines are present if loading older data
        const hydratedData = {
          ...initialData,
          ...parsed,
          team: parsed.team && parsed.team.length > 0 ? parsed.team : initialData.team,
          projects: parsed.projects && parsed.projects.length > 0 ? parsed.projects : initialData.projects,
          activeProjectId: parsed.activeProjectId || initialData.activeProjectId,
          habits: parsed.habits || initialData.habits,
          routines: parsed.routines || initialData.routines,
          focusSessions: parsed.focusSessions || initialData.focusSessions
        }
        const timer = setTimeout(() => setBoardData(hydratedData), 0)
        return () => clearTimeout(timer)
      } catch (e) {
        console.error("Failed to parse board data", e)
      }
    }
  }, [])

  // Save to localStorage
  React.useEffect(() => {
    if (isMounted) {
      localStorage.setItem("routineTrackBoard", JSON.stringify(boardData))
    }
  }, [boardData, isMounted])

  // Auto-cleanup "Done" tasks from columns after 48 hours
  React.useEffect(() => {
    if (!isMounted) return

    const cleanup = () => {
      const now = new Date().getTime()
      const fortyEightHoursInMs = 48 * 60 * 60 * 1000

      setBoardData(prev => {
        let hasChanges = false
        const newColumns = { ...prev.columns }
        const doneCol = newColumns["Done"]
        
        if (!doneCol) return prev

        const updatedDoneTaskIds = doneCol.taskIds.filter(taskId => {
          const task = prev.tasks[taskId]
          if (task && task.status === "Done" && task.completedAt) {
            const completedTime = new Date(task.completedAt).getTime()
            if (now - completedTime > fortyEightHoursInMs) {
              hasChanges = true
              return false // Remove from column
            }
          }
          return true
        })

        if (!hasChanges) return prev

        return {
          ...prev,
          columns: {
            ...prev.columns,
            "Done": { ...doneCol, taskIds: updatedDoneTaskIds }
          }
        }
      })
    }

    // Run once on mount and then every hour
    cleanup()
    const interval = setInterval(cleanup, 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [isMounted])

  const addTask = (taskData: Omit<Task, "id" | "status" | "projectId">, columnId: Status) => {
    const newId = `T-${Math.floor(Math.random() * 1000) + 200}`
    const newTask: Task = { 
      ...taskData, 
      id: newId, 
      status: columnId, 
      projectId: boardData.activeProjectId, 
      subTasks: taskData.subTasks || [],
      completedAt: columnId === "Done" ? new Date().toISOString() : undefined
    }
    
    setBoardData(prev => {
      const col = prev.columns[columnId]
      return {
        ...prev,
        tasks: { ...prev.tasks, [newId]: newTask },
        columns: {
          ...prev.columns,
          [columnId]: { ...col, taskIds: [...col.taskIds, newId] }
        }
      }
    })
  }

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setBoardData(prev => {
      const task = prev.tasks[taskId]
      if (!task) return prev
      
      const newStatus = updates.status
      let newColumns = prev.columns
      const finalUpdates = { ...updates }

      // If status changed, we need to move the task between columns
      if (newStatus && newStatus !== task.status) {
        const oldCol = prev.columns[task.status]
        const newCol = prev.columns[newStatus]
        
        // Handle completedAt
        if (newStatus === "Done") {
          finalUpdates.completedAt = new Date().toISOString()
        } else {
          finalUpdates.completedAt = undefined
        }

        newColumns = {
          ...prev.columns,
          [task.status]: { ...oldCol, taskIds: oldCol.taskIds.filter(id => id !== taskId) },
          [newStatus]: { ...newCol, taskIds: [...newCol.taskIds, taskId] }
        }
      }

      return {
        ...prev,
        tasks: {
          ...prev.tasks,
          [taskId]: { ...task, ...finalUpdates }
        },
        columns: newColumns
      }
    })
  }

  const toggleSubTask = (taskId: string, subTaskId: string) => {
    setBoardData(prev => {
      const task = prev.tasks[taskId]
      if (!task || !task.subTasks) return prev

      const updatedSubTasks = task.subTasks.map(st => 
        st.id === subTaskId ? { ...st, completed: !st.completed } : st
      )
      
      // Auto-complete logic
      const allDone = updatedSubTasks.every(st => st.completed)
      const newStatus = allDone ? "Done" : (task.status === "Done" ? "Todo" : task.status)
      
      const updates: Partial<Task> = { 
        subTasks: updatedSubTasks,
        status: newStatus,
        completedAt: newStatus === "Done" && task.status !== "Done" ? new Date().toISOString() : (newStatus !== "Done" ? undefined : task.completedAt)
      }

      let newColumns = prev.columns
      if (newStatus !== task.status) {
        const oldCol = prev.columns[task.status]
        const newCol = prev.columns[newStatus]
        newColumns = {
          ...prev.columns,
          [task.status]: { ...oldCol, taskIds: oldCol.taskIds.filter(id => id !== taskId) },
          [newStatus]: { ...newCol, taskIds: [...newCol.taskIds, taskId] }
        }
      }

      return {
        ...prev,
        tasks: {
          ...prev.tasks,
          [taskId]: { ...task, ...updates }
        },
        columns: newColumns
      }
    })
  }

  const addSubTask = (taskId: string, title: string) => {
    setBoardData(prev => {
      const task = prev.tasks[taskId]
      if (!task) return prev
      const newSubTask: SubTask = { id: `st-${Math.random().toString(36).substr(2, 9)}`, title, completed: false }
      return {
        ...prev,
        tasks: {
          ...prev.tasks,
          [taskId]: { ...task, subTasks: [...(task.subTasks || []), newSubTask] }
        }
      }
    })
  }

  const removeSubTask = (taskId: string, subTaskId: string) => {
    setBoardData(prev => {
      const task = prev.tasks[taskId]
      if (!task || !task.subTasks) return prev
      return {
        ...prev,
        tasks: {
          ...prev.tasks,
          [taskId]: { ...task, subTasks: task.subTasks.filter(st => st.id !== subTaskId) }
        }
      }
    })
  }

  const deleteTask = (taskId: string) => {
    setBoardData(prev => {
      const task = prev.tasks[taskId]
      if (!task) return prev

      const newTasks = { ...prev.tasks }
      delete newTasks[taskId]

      const col = prev.columns[task.status]
      return {
        ...prev,
        tasks: newTasks,
        columns: {
          ...prev.columns,
          [task.status]: { ...col, taskIds: col.taskIds.filter(id => id !== taskId) }
        }
      }
    })
  }

  const setActiveProjectId = (projectId: string) => {
    setBoardData(prev => ({ ...prev, activeProjectId: projectId }))
  }

  const addProject = (projectData: Omit<Project, "id">) => {
    const newId = `p-${Math.floor(Math.random() * 1000) + 100}`
    const newProject: Project = { ...projectData, id: newId }
    
    setBoardData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject],
      activeProjectId: newId
    }))
  }

  const addHabit = (habitData: Omit<Habit, "id" | "completedDates" | "streak" | "longestStreak" | "createdAt">) => {
    const newId = `h-${Math.random().toString(36).substr(2, 9)}`
    const newHabit: Habit = {
      ...habitData,
      id: newId,
      completedDates: [],
      streak: 0,
      longestStreak: 0,
      createdAt: new Date().toISOString()
    }
    setBoardData(prev => ({
      ...prev,
      habits: [...prev.habits, newHabit]
    }))
  }

  const addDailyTask = (taskData: Omit<Task, "id" | "status" | "projectId">, date: string) => {
    const newId = `DT-${Math.floor(Math.random() * 10000) + 1000}`
    const newTask: Task = { 
      ...taskData, 
      id: newId, 
      status: "Todo", 
      projectId: "daily", // Special project ID for daily tasks
      dailyDate: date,
      completedAt: undefined
    }
    
    setBoardData(prev => ({
      ...prev,
      tasks: { ...prev.tasks, [newId]: newTask }
    }))
  }

  const toggleDailyTask = (taskId: string) => {
    setBoardData(prev => {
      const task = prev.tasks[taskId]
      if (!task) return prev
      const newStatus = task.status === "Done" ? "Todo" : "Done"
      return {
        ...prev,
        tasks: {
          ...prev.tasks,
          [taskId]: { 
            ...task, 
            status: newStatus,
            completedAt: newStatus === "Done" ? new Date().toISOString() : undefined
          }
        }
      }
    })
  }

  const toggleHabit = (habitId: string, date: string) => {
    setBoardData(prev => ({
      ...prev,
      habits: prev.habits.map(h => {
        if (h.id !== habitId) return h
        const isCompleted = h.completedDates.includes(date)
        const newDates = isCompleted 
          ? h.completedDates.filter(d => d !== date) 
          : [...h.completedDates, date]
        return { ...h, completedDates: newDates }
      })
    }))
  }

  const toggleRoutineTask = (type: "morning" | "night", taskId: string) => {
    setBoardData(prev => ({
      ...prev,
      routines: {
        ...prev.routines,
        [type]: {
          ...prev.routines[type],
          tasks: prev.routines[type].tasks.map(t => {
            if (t.id === taskId) {
              return { ...t, completed: !t.completed }
            }
            return t
          })
        }
      }
    }))
  }

  const addRoutineTask = (type: "morning" | "night", title: string) => {
    const newTask: RoutineTask = { id: `rt-${Math.random().toString(36).substr(2, 9)}`, title, completed: false }
    setBoardData(prev => ({
      ...prev,
      routines: {
        ...prev.routines,
        [type]: {
          ...prev.routines[type],
          tasks: [...prev.routines[type].tasks, newTask]
        }
      }
    }))
  }

  const addFocusSession = (session: Omit<FocusSession, "id" | "date">) => {
    const newSession: FocusSession = { ...session, id: `fs-${Date.now()}`, date: new Date().toISOString() }
    setBoardData(prev => ({
      ...prev,
      focusSessions: [...prev.focusSessions, newSession]
    }))
  }

  if (!isMounted) return null // Avoid hydration mismatch

  return (
    <BoardContext.Provider value={{ boardData, setBoardData, addTask, updateTask, toggleSubTask, removeSubTask, addSubTask, deleteTask, setActiveProjectId, addProject, addHabit, addDailyTask, toggleDailyTask, toggleHabit, toggleRoutineTask, addRoutineTask, addFocusSession }}>
      {children}
    </BoardContext.Provider>
  )
}

export function useBoard() {
  const context = React.useContext(BoardContext)
  if (context === undefined) {
    throw new Error("useBoard must be used within a BoardProvider")
  }
  return context
}
