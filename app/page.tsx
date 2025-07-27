"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { ChatInterface } from "@/components/chat-interface"
import type { Conversation } from "@/types/conversation"

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Load conversations from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("octopusx-conversations")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        const conversationsWithDates = parsed.map((conv: any) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          updatedAt: new Date(conv.updatedAt),
        }))
        setConversations(conversationsWithDates)
      } catch (error) {
        console.error("Failed to load conversations:", error)
      }
    }
  }, [])

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem("octopusx-conversations", JSON.stringify(conversations))
    }
  }, [conversations])

  const createConversation = (firstMessage: string): string => {
    const newId = Date.now().toString()
    const newConversation: Conversation = {
      id: newId,
      title: firstMessage.slice(0, 50) + (firstMessage.length > 50 ? "..." : ""),
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setConversations((prev) => [newConversation, ...prev])
    setCurrentConversationId(newId)
    return newId
  }

  const updateConversationTitle = (id: string, title: string) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === id
          ? {
              ...conv,
              title,
              updatedAt: new Date(),
            }
          : conv,
      ),
    )
  }

  const deleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((conv) => conv.id !== id))
    if (currentConversationId === id) {
      setCurrentConversationId(null)
    }
  }

  const selectConversation = (id: string) => {
    setCurrentConversationId(id)
    setSidebarOpen(false)
  }

  const startNewConversation = () => {
    setCurrentConversationId(null)
    setSidebarOpen(false)
  }

  const currentConversation = conversations.find((conv) => conv.id === currentConversationId)

  return (
    <div className="flex h-screen bg-gray-950 text-white">
      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={selectConversation}
        onDeleteConversation={deleteConversation}
        onNewConversation={startNewConversation}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <ChatInterface
          conversationId={currentConversationId}
          onUpdateTitle={updateConversationTitle}
          onCreateConversation={createConversation}
          conversations={conversations}
          setConversations={setConversations}
        />
      </div>
    </div>
  )
}
