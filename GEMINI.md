# Gemini CLI Context: Task Manager (RoutineTrack)

This project is a high-end, production-grade Task Management application built with Next.js 16, React 19, and Tailwind CSS 4. It provides a comprehensive suite of tools for project management, team collaboration, and daily routine optimization, all featuring a "luxury" aesthetic with smooth animations.

## Project Overview

- **Core Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4.
- **State Management:** React Context API (`BoardProvider` in `context/BoardContext.tsx`) with `localStorage` persistence.
- **Drag & Drop:** Powered by `@dnd-kit/core` and `@dnd-kit/sortable`.
- **UI & Icons:** `lucide-react` for icons, `framer-motion` for animations, and Radix UI primitives.
- **Features:** 
    - **Multi-Project Management:** Create, switch, and manage multiple projects independently.
    - **Kanban Board:** High-precision, project-specific task tracking.
    - **Daily Tasks:** A 30-day scheduling system with completion tracking and daily performance intelligence.
    - **Team Integration:** Project member management with role tracking and active task metrics.
- **Theme:** Dark mode by default (configured in `app/layout.tsx`).

## Directory Structure

- `app/`: Next.js App Router pages and layouts.
  - `dashboard/`, `tasks/`, `daily/`, `team/`: Core application routes.
- `components/`: Modular component architecture.
  - `board/`: Kanban board logic.
  - `dashboard/`: Project-specific metrics view.
  - `layout/`: App shell (Header, Sidebar, AppLayout).
  - `task/`: Task forms, panels, and 'My Tasks'/'Daily Tasks' views.
  - `team/`: Team management and member profile views.
  - `project/`: Project creation forms.
  - `ui/`: Reusable primitives (Button, Badge, Card, SlideOver).
- `context/`: Application state providers.
- `lib/`: Utility functions (e.g., `tailwind-merge` helpers).
- `types/`: TypeScript interfaces for Tasks, Projects, Team, and Board data.

## Building and Running

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm run start
```

### Linting
```bash
npm run lint
```

## Development Conventions

- **Component Patterns:** Prefer functional components with hooks. Use `"use client"` directive for interactive components.
- **Styling:** Use Tailwind CSS 4 utility classes. Utilize `cn()` helper from `lib/utils.ts` for conditional class merging.
- **Type Safety:** Maintain strict TypeScript definitions in `types/index.ts`. Avoid `any`.
- **State Flow:** Centralized board state in `BoardContext`. Use the `useBoard` hook to access and update task data.
- **Persistence:** Board data is automatically persisted to `localStorage` under the key `routineTrackBoard`.
- **UI/UX:** Focus on "Luxury" feel—ensure smooth transitions using `framer-motion`, high-end typography, and consistent spacing.
- **Defensive Coding:** Always apply safety checks (e.g., `if (!boardData) return null`) when accessing context data to prevent runtime crashes during hydration.
