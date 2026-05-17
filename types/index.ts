export type Priority = "Low" | "Medium" | "High" | "Urgent";
export type Status = "Todo" | "In Progress" | "In Review" | "Done";

export interface SubTask {
  id: string
  title: string
  completed: boolean
  dueDate?: string
  priority?: Priority
}

export interface Project {
  id: string;
  name: string;
  color: string;
  description?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  projectId: string;
  dailyDate?: string;
  assignee?: {
    name: string;
    avatar?: string;
  };
  dueDate?: string;
  subTasks?: SubTask[];
}

export interface Column {
  id: Status;
  title: string;
  taskIds: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar?: string;
  bio?: string;
}

export interface Habit {
  id: string
  title: string
  description?: string
  icon?: string
  color: string
  frequency: "daily" | "weekly"
  completedDates: string[] // ISO dates (YYYY-MM-DD)
  streak: number
  longestStreak: number
  createdAt: string
}

export interface RoutineTask {
  id: string
  title: string
  completed: boolean
}

export interface Routine {
  id: string
  type: "morning" | "night"
  tasks: RoutineTask[]
}

export interface FocusSession {
  id: string
  duration: number // minutes
  date: string
  type: "focus" | "break"
}

export interface BoardData {
  tasks: Record<string, Task>;
  columns: Record<Status, Column>;
  columnOrder: Status[];
  team: TeamMember[];
  projects: Project[];
  activeProjectId: string;
  habits: Habit[];
  routines: { morning: Routine; night: Routine };
  focusSessions: FocusSession[];
}
