"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { ChatInterface } from "@/components/chat-interface"
import { Header } from "@/components/header"
import type { Conversation } from "@/types/conversation"

export default function OctopusX() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Load conversations from localStorage on mount
  useEffect(() => {
    const savedConversations = localStorage.getItem("octopusx-conversations")
    if (savedConversations) {
      try {
        const parsed = JSON.parse(savedConversations)
        // Convert date strings back to Date objects
        const conversationsWithDates = parsed.map((conv: any) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          updatedAt: new Date(conv.updatedAt),
        }))
        setConversations(conversationsWithDates)
        if (conversationsWithDates.length > 0 && !currentConversationId) {
          setCurrentConversationId(conversationsWithDates[0].id)
        }
      } catch (error) {
        console.error("Error loading conversations:", error)
        setConversations([])
      }
    }
  }, []) // Remove currentConversationId from dependency array

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem("octopusx-conversations", JSON.stringify(conversations))
    }
  }, [conversations])

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: "New Security Analysis",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setConversations((prev) => [newConversation, ...prev])
    setCurrentConversationId(newConversation.id)
  }

  const updateConversationTitle = (id: string, title: string) => {
    setConversations((prev) => prev.map((conv) => (conv.id === id ? { ...conv, title, updatedAt: new Date() } : conv)))
  }

  const deleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((conv) => conv.id !== id))
    if (currentConversationId === id) {
      const remaining = conversations.filter((conv) => conv.id !== id)
      setCurrentConversationId(remaining.length > 0 ? remaining[0].id : null)
    }
  }

  const createConversationFromMessage = (firstMessage: string) => {
    const title = firstMessage.slice(0, 50) + (firstMessage.length > 50 ? "..." : "")
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: title || "New Security Analysis",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setConversations((prev) => [newConversation, ...prev])
    setCurrentConversationId(newConversation.id)
    return newConversation.id
  }

  const currentConversation = conversations.find((conv) => conv.id === currentConversationId)

  return (
    <div className="flex h-screen bg-gray-950 text-green-100">
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
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} currentConversation={currentConversation} />

        <ChatInterface
          conversationId={currentConversationId}
          onUpdateTitle={updateConversationTitle}
          onCreateConversation={createConversationFromMessage}
          conversations={conversations}
          setConversations={setConversations}
        />
      </div>
    </div>
  )
}
