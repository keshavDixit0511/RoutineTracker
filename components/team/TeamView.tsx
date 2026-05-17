"use client"

import * as React from "react"
import { useBoard } from "@/context/BoardContext"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Mail, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"

export function TeamView() {
  const { boardData } = useBoard()
  
  if (!boardData) return null

  const { team = [], tasks = {} } = boardData
  
  const allTasks = Object.values(tasks)

  const getMemberStats = (memberName: string) => {
    const memberTasks = allTasks.filter(t => t.assignee?.name === memberName)
    const active = memberTasks.filter(t => t.status !== "Done").length
    const completed = memberTasks.filter(t => t.status === "Done").length
    const urgent = memberTasks.filter(t => t.priority === "Urgent" && t.status !== "Done").length
    
    return { active, completed, urgent }
  }

  return (
    <div className="p-10 flex flex-col gap-10 w-full max-w-7xl mx-auto h-full overflow-y-auto custom-scrollbar">
      {/* Header Section */}
      <div className="space-y-2">
        <h2 className="text-4xl font-black text-foreground tracking-tighter uppercase italic">
          Project <span className="text-primary not-italic tracking-normal">Team</span>
        </h2>
        <p className="text-text-muted font-medium">The elite collective driving project velocity and excellence.</p>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
        {team.map((member, index) => {
          const stats = getMemberStats(member.name)
          
          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="group bg-surface/30 border-border/50 backdrop-blur-md overflow-hidden hover:border-primary/30 transition-all duration-500">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    {/* Left: Profile Image & Role */}
                    <div className="relative w-full sm:w-48 bg-surface-hover/30 p-6 flex flex-col items-center justify-center gap-4 border-b sm:border-b-0 sm:border-r border-border/50">
                      <div className="relative">
                        <div className="h-24 w-24 rounded-2xl overflow-hidden border-2 border-primary/20 group-hover:border-primary/50 transition-colors shadow-2xl">
                          <img 
                            src={member.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${member.name}`} 
                            alt={member.name} 
                            className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
                          />
                        </div>
                        <div className="absolute -bottom-2 -right-2 h-6 w-6 rounded-full bg-success border-4 border-surface flex items-center justify-center" title="Available" />
                      </div>
                      <div className="text-center">
                        <h3 className="font-bold text-foreground text-lg">{member.name}</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/80">{member.role}</p>
                      </div>
                    </div>

                    {/* Right: Info & Stats */}
                    <div className="flex-1 p-6 flex flex-col gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-text-muted">
                          <Mail className="h-3 w-3" />
                          <span className="text-xs font-medium">{member.email}</span>
                        </div>
                        <p className="text-sm text-text-muted/80 leading-relaxed italic">
                          &quot;{member.bio}&quot;
                        </p>
                      </div>

                      {/* Member Stats */}
                      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/30">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-tighter text-text-muted">
                            <Clock className="h-3 w-3 text-info" />
                            Active
                          </div>
                          <span className="text-xl font-black text-foreground">{stats.active}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-tighter text-text-muted">
                            <CheckCircle2 className="h-3 w-3 text-success" />
                            Done
                          </div>
                          <span className="text-xl font-black text-foreground">{stats.completed}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-tighter text-text-muted">
                            <AlertCircle className="h-3 w-3 text-gold" />
                            Urgent
                          </div>
                          <span className="text-xl font-black text-gold">{stats.urgent}</span>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 mt-auto">
                        <Badge variant="outline" className="h-7 cursor-pointer hover:bg-surface-hover">View Profile</Badge>
                        <Badge variant="primary" className="h-7 cursor-pointer">Message</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
