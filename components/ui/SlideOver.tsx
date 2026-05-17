"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface SlideOverProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function SlideOver({ isOpen, onClose, title, children }: SlideOverProps) {
  // Prevent body scroll when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-glass-border bg-surface shadow-2xl glass"
          >
            <div className="flex items-center justify-between border-b border-border p-6">
              <h2 className="text-lg font-semibold text-foreground">{title}</h2>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
