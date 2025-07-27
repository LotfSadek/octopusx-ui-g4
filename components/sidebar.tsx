"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, MessageSquare, Trash2, Edit3, Check, X, Shield, ChevronLeft } from "lucide-react"
import type { Conversation } from "@/types/conversation"
import { cn } from "@/lib/utils"

// Add this helper function at the top of the component, after the imports
const formatDate = (date: Date | string) => {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date
    return dateObj.toLocaleDateString()
  } catch (error) {
    return "Invalid date"
  }
}

interface SidebarProps {
  conversations: Conversation[]
  currentConversationId: string | null
  onSelectConversation: (id: string) => void
  onNewConversation: () => void
  onDeleteConversation: (id: string) => void
  isOpen: boolean
  onToggle: () => void
}

export function Sidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  isOpen,
  onToggle,
}: SidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")

  const startEditing = (conversation: Conversation) => {
    setEditingId(conversation.id)
    setEditTitle(conversation.title)
  }

  const saveEdit = () => {
    if (editingId && editTitle.trim()) {
      // This would need to be connected to the parent component
      setEditingId(null)
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditTitle("")
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onToggle} />}

      <div
        className={cn(
          "fixed lg:relative inset-y-0 left-0 z-50 w-80 bg-gray-900 border-r border-green-500/20 flex flex-col transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-0 lg:overflow-hidden",
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-green-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-green-400" />
              <h1 className="text-xl font-bold text-green-400">OctopusX</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="lg:hidden text-green-400 hover:text-green-300"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>

          <Button
            onClick={onNewConversation}
            className="w-full bg-green-600 hover:bg-green-700 text-white border border-green-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Security Analysis
          </Button>
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1 p-2">
          <div className="space-y-1">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={cn(
                  "group relative rounded-lg p-3 cursor-pointer transition-all duration-200",
                  currentConversationId === conversation.id
                    ? "bg-green-600/20 border border-green-500/30"
                    : "hover:bg-gray-800 border border-transparent",
                )}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="flex items-start space-x-3">
                  <MessageSquare className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />

                  <div className="flex-1 min-w-0">
                    {editingId === conversation.id ? (
                      <div className="flex items-center space-x-1">
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="h-6 text-sm bg-gray-800 border-green-500/30"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEdit()
                            if (e.key === "Escape") cancelEdit()
                          }}
                          autoFocus
                        />
                        <Button size="sm" variant="ghost" onClick={saveEdit}>
                          <Check className="h-3 w-3 text-green-400" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={cancelEdit}>
                          <X className="h-3 w-3 text-red-400" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-green-100 truncate">{conversation.title}</p>
                        <p className="text-xs text-green-400/70 mt-1">{formatDate(conversation.updatedAt)}</p>
                      </>
                    )}
                  </div>

                  {editingId !== conversation.id && (
                    <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 transition-opacity">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          startEditing(conversation)
                        }}
                        className="h-6 w-6 p-0 text-green-400 hover:text-green-300"
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteConversation(conversation.id)
                        }}
                        className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-green-500/20">
          <div className="text-xs text-green-400/70 text-center">SOC Intelligence Platform</div>
        </div>
      </div>
    </>
  )
}
