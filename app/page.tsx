"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { ChatInterface } from "@/components/chat-interface"
import type { Conversation } from "@/types/conversation"

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

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

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: `Conversation ${conversations.length + 1}`,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setConversations((prev) => [newConversation, ...prev])
    setCurrentConversationId(newConversation.id)
  }

  const updateConversation = (id: string, updates: Partial<Conversation>) => {
    setConversations((prev) =>
      prev.map((conv) => (conv.id === id ? { ...conv, ...updates, updatedAt: new Date() } : conv)),
    )
  }

  const deleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((conv) => conv.id !== id))
    if (currentConversationId === id) {
      setCurrentConversationId(null)
    }
  }

  const currentConversation = conversations.find((conv) => conv.id === currentConversationId)

  return (
    <div className="flex h-screen bg-gray-950">
      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={setCurrentConversationId}
        onNewConversation={createNewConversation}
        onDeleteConversation={deleteConversation}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 flex flex-col">
        <Header onNewConversation={createNewConversation} />

        <ChatInterface
          conversation={currentConversation}
          onUpdateConversation={updateConversation}
          onCreateConversation={createNewConversation}
        />
      </div>
    </div>
  )
}
