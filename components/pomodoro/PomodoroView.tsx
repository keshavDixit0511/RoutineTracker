"use client"

import * as React from "react"
import Link from "next/link"
import { useBoard } from "@/context/BoardContext"
import { Button } from "@/components/ui/Button"
import { motion, AnimatePresence } from "framer-motion"
import { Award, X, Maximize, Minimize } from "lucide-react"
import { cn } from "@/lib/utils"

const QUOTES = [
  "Focus is the key to mastery.",
  "Quality over quantity, every single time.",
  "Small steps lead to massive results.",
  "Your discipline today is your freedom tomorrow.",
  "Stay focused, stay consistent.",
  "The secret of getting ahead is getting started.",
  "Success is the sum of small efforts, repeated."
]

export function PomodoroView() {
  const { addFocusSession } = useBoard()
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [isActive, setIsActive] = React.useState(false)
  const [mode, setMode] = React.useState<"focus" | "break">("focus")
  const [focusDur, setFocusDur] = React.useState(25)
  const [breakDur, setBreakDur] = React.useState(5)
  const [elapsed, setElapsed] = React.useState(0)
  const [timeLeft, setTimeLeft] = React.useState(breakDur * 60)
  const [showSuccess, setShowSuccess] = React.useState(false)
  const [currentQuote, setCurrentQuote] = React.useState("")
  const [isFullscreen, setIsFullscreen] = React.useState(false)

  const handleComplete = React.useCallback(() => {
    setIsActive(false)
    addFocusSession({ duration: mode === "focus" ? focusDur : breakDur, type: mode })
    if (mode === "focus") {
      setCurrentQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)])
      setShowSuccess(true)
    } else {
      setMode("focus")
      setElapsed(0)
    }
  }, [addFocusSession, mode, focusDur, breakDur])

  const startBreak = () => {
    setShowSuccess(false)
    setMode("break")
    setElapsed(0)
    setTimeLeft(breakDur * 60)
    setIsActive(true)
  }

  const toggleFullscreen = async () => {
    if (!containerRef.current) return

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen()
        setIsFullscreen(true)
      } else {
        await document.exitFullscreen()
        setIsFullscreen(false)
      }
    } catch (err) {
      console.error(`Error attempting to toggle full-screen mode: ${err}`)
    }
  }

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  React.useEffect(() => {
    let interval: NodeJS.Timeout
    if (isActive) {
      interval = setInterval(() => {
        if (mode === "focus") {
          const nextElapsed = elapsed + 1
          setElapsed(nextElapsed)
          if (nextElapsed >= focusDur * 60) handleComplete()
        } else {
          setTimeLeft(prev => {
            const nextTime = prev - 1
            if (nextTime <= 0) handleComplete()
            return nextTime
          })
        }
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isActive, elapsed, timeLeft, mode, focusDur, breakDur, handleComplete])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0')
    const secs = (seconds % 60).toString().padStart(2, '0')
    return `${mins}:${secs}`
  }

  return (
    <div 
      ref={containerRef}
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center p-4 md:p-6 transition-all duration-700",
        isFullscreen ? "bg-black" : "bg-background"
      )}
    >
      {/* Background Effects */}
      <div className={cn(
        "absolute inset-0 transition-all duration-1000",
        mode === "focus" 
          ? (isFullscreen ? "bg-gradient-to-b from-black via-zinc-900 to-black" : "bg-background") 
          : "bg-primary/5"
      )} />
      
      {/* Ambient Glow */}
      {isActive && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: isFullscreen ? 0.15 : 0.05 }}
          className={cn(
            "absolute inset-0 blur-[60px] md:blur-[120px] pointer-events-none",
            mode === "focus" ? "bg-primary" : "bg-success"
          )}
        />
      )}

      {/* Header Controls */}
      <div className="absolute top-4 right-4 md:top-8 md:right-8 z-50 flex items-center gap-2 md:gap-4">
        <button 
          onClick={toggleFullscreen}
          className="p-2 md:p-3 rounded-full bg-surface-hover/50 backdrop-blur-md hover:bg-primary/20 transition-all text-foreground/70 hover:text-foreground"
          title={isFullscreen ? "Exit Full Screen" : "Enter Full Screen"}
        >
          {isFullscreen ? <Minimize className="h-4 w-4 md:h-5 md:w-5" /> : <Maximize className="h-4 w-4 md:h-5 md:w-5" />}
        </button>
        <Link 
          href="/" 
          className={cn(
            "p-2 md:p-3 rounded-full bg-surface-hover/50 backdrop-blur-md hover:bg-destructive/20 transition-all text-foreground/70 hover:text-foreground",
            isFullscreen && "opacity-20 hover:opacity-100"
          )}
        >
          <X className="h-4 w-4 md:h-5 md:w-5" />
        </Link>
      </div>
      
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute z-50 p-6 md:p-10 rounded-3xl bg-surface/90 backdrop-blur-xl border border-primary/20 text-center shadow-2xl w-[90%] max-w-sm"
          >
            <Award className="h-12 w-12 md:h-20 md:w-20 mx-auto text-gold mb-4 md:mb-6" />
            <h2 className="text-2xl md:text-3xl font-black mb-1 md:mb-2">Well Done!</h2>
            <p className="text-xs md:text-sm text-text-muted mb-3 md:mb-4">You completed {focusDur} minutes of deep work.</p>
            <p className="text-primary italic mb-6 md:mb-8 font-medium text-sm md:text-base">&quot;{currentQuote}&quot;</p>
            <Button onClick={startBreak} size="lg" className="w-full h-10 md:h-12 rounded-xl font-bold uppercase tracking-widest text-xs md:text-sm">
              Start Break
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={cn(
        "relative z-10 w-full max-w-4xl flex flex-col items-center transition-all duration-700",
        isFullscreen ? "gap-8 md:gap-12" : "gap-6 md:gap-8"
      )}>
        {!isActive && !showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 md:gap-4 justify-center"
          >
             <div className="flex flex-col gap-1 md:gap-2">
               <label className="text-[10px] md:text-xs font-bold uppercase text-text-muted tracking-widest">Focus</label>
               <input 
                 type="number" 
                 value={focusDur} 
                 onChange={(e) => setFocusDur(Number(e.target.value))} 
                 className="w-16 md:w-24 bg-surface/50 backdrop-blur-md rounded-xl md:rounded-2xl p-2 md:p-4 text-center border border-border focus:border-primary outline-none text-base md:text-xl font-bold" 
               />
             </div>
             <div className="flex flex-col gap-1 md:gap-2">
               <label className="text-[10px] md:text-xs font-bold uppercase text-text-muted tracking-widest">Break</label>
               <input 
                 type="number" 
                 value={breakDur} 
                 onChange={(e) => setBreakDur(Number(e.target.value))} 
                 className="w-16 md:w-24 bg-surface/50 backdrop-blur-md rounded-xl md:rounded-2xl p-2 md:p-4 text-center border border-border focus:border-primary outline-none text-base md:text-xl font-bold" 
               />
             </div>
          </motion.div>
        )}

        <motion.div 
          layout
          animate={{ 
            scale: isFullscreen ? 1.1 : 1,
            opacity: isFullscreen && !isActive ? 0.7 : 1
          }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className={cn(
            "font-black tracking-tighter tabular-nums transition-colors duration-1000",
            isFullscreen ? "text-[6rem] sm:text-[10rem] md:text-[15rem] leading-none" : "text-[5rem] sm:text-[8rem] md:text-[10rem]",
            mode === "focus" ? "text-foreground" : "text-primary"
          )}
        >
          {mode === "focus" ? formatTime(elapsed) : formatTime(timeLeft)}
        </motion.div>

        <div className={cn(
          "flex items-center justify-center transition-all duration-500",
          isFullscreen ? "gap-6 md:gap-12 opacity-40 hover:opacity-100" : "gap-4 md:gap-6"
        )}>
          <Button 
            onClick={() => setIsActive(!isActive)} 
            variant="default" 
            size="lg" 
            className={cn(
              "rounded-full font-black uppercase tracking-widest transition-all",
              isFullscreen ? "h-14 md:h-20 px-8 md:px-12 text-sm md:text-lg" : "h-12 md:h-16 px-6 md:px-8 text-xs md:text-sm"
            )}
          >
            {isActive ? "Pause" : "Start Focus"}
          </Button>
          <Button 
            onClick={() => { setIsActive(false); setElapsed(0); setTimeLeft(breakDur * 60) }} 
            variant="secondary" 
            size="lg" 
            className={cn(
              "rounded-full font-black uppercase tracking-widest transition-all",
              isFullscreen ? "h-14 md:h-20 px-8 md:px-12 text-sm md:text-lg" : "h-12 md:h-16 px-6 md:px-8 text-xs md:text-sm"
            )}
          >
            Reset
          </Button>
        </div>
        
        <p className={cn(
          "text-[10px] md:text-sm text-text-muted uppercase tracking-[0.3em] font-medium transition-all",
          isFullscreen ? "mt-8 md:mt-12 opacity-30" : "mt-6 md:mt-8"
        )}>
          {mode} Mode
        </p>
      </div>
    </div>
  )
}
