import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline" | "gold" | "secondary" | "danger" | "success" | "info" | "warning" | "primary"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border px-2 py-0.5 text-[10px] font-black uppercase tracking-wider transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-border focus:ring-offset-2",
        {
          "border-transparent bg-primary text-background shadow-sm shadow-primary/20": variant === "default" || variant === "primary",
          "border-border/50 bg-surface text-text-muted hover:bg-surface-hover": variant === "secondary",
          "border-border/80 text-foreground bg-transparent": variant === "outline",
          "border-gold/30 bg-gold/10 text-gold shadow-sm shadow-gold/10": variant === "gold",
          "border-error/30 bg-error/10 text-error shadow-sm shadow-error/10": variant === "danger",
          "border-success/30 bg-success/10 text-success shadow-sm shadow-success/10": variant === "success",
          "border-info/30 bg-info/10 text-info shadow-sm shadow-info/10": variant === "info",
          "border-warning/30 bg-warning/10 text-warning shadow-sm shadow-warning/10": variant === "warning",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
