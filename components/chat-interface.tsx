"use client"

import type React from "react"

import { useChat } from "ai/react"
import { useEffect, useRef } from "react"
import { MessageList } from "./message-list"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Paperclip, Shield, AlertTriangle, Search, Database } from "lucide-react"
import { FileUpload } from "./file-upload"
import type { Conversation } from "@/types/conversation"
import { LLM_CONFIG } from "@/lib/config"

interface ChatInterfaceProps {
  conversation?: Conversation
  onUpdateConversation: (id: string, updates: Partial<Conversation>) => void
  onCreateConversation: () => void
}

export function ChatInterface({ conversation, onUpdateConversation, onCreateConversation }: ChatInterfaceProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: "/api/chat",
    onFinish: (message) => {
      if (conversation) {
        // Update existing conversation
        const updatedMessages = [...messages, message]
        onUpdateConversation(conversation.id, {
          messages: updatedMessages,
          title:
            conversation.title === `Conversation ${conversation.id}` && messages.length === 1
              ? messages[0].content.slice(0, 50) + (messages[0].content.length > 50 ? "..." : "")
              : conversation.title,
        })
      }
    },
  })

  // Load conversation messages when conversation changes
  useEffect(() => {
    if (conversation) {
      setMessages(conversation.messages)
    } else {
      setMessages([])
    }
  }, [conversation, setMessages])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"
    }
  }, [input])

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    // If no conversation exists, create one first
    if (!conversation) {
      onCreateConversation()
      // The conversation will be created and this component will re-render
      // We'll handle the message submission in the next render cycle
      return
    }

    handleSubmit(e)
  }

  const quickPrompts = [
    {
      icon: Shield,
      title: "Threat Analysis",
      prompt: "Analyze this potential security threat and provide recommendations for mitigation.",
    },
    {
      icon: AlertTriangle,
      title: "Incident Response",
      prompt: "Guide me through the incident response process for a suspected data breach.",
    },
    {
      icon: Search,
      title: "Log Analysis",
      prompt: "Help me analyze these security logs for suspicious activities.",
    },
    {
      icon: Database,
      title: "Vulnerability Assessment",
      prompt: "Perform a vulnerability assessment on my network infrastructure.",
    },
  ]

  const handleQuickPrompt = (prompt: string) => {
    if (!conversation) {
      onCreateConversation()
    }
    handleInputChange({ target: { value: prompt } } as any)
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {!conversation || messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-4xl mx-auto w-full">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Shield className="h-16 w-16 text-green-500 animate-pulse-green" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Welcome to OctopusX</h1>
            <p className="text-xl text-gray-400 mb-2">Your Advanced Cybersecurity AI Assistant</p>
            <p className="text-sm text-gray-500">
              Powered by {LLM_CONFIG.provider === "openai" ? "OpenAI" : "Langchain"} • Ready for SOC Operations
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12 w-full max-w-2xl">
            {quickPrompts.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-6 border-green-600/30 hover:border-green-500/50 hover:bg-green-900/20 text-left flex flex-col items-start gap-3 transition-all duration-200 bg-transparent"
                onClick={() => handleQuickPrompt(prompt.prompt)}
              >
                <prompt.icon className="h-6 w-6 text-green-500" />
                <div>
                  <div className="font-semibold text-white mb-1">{prompt.title}</div>
                  <div className="text-sm text-gray-400 line-clamp-2">{prompt.prompt}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-hidden">
          <MessageList messages={messages} isLoading={isLoading} />
        </div>
      )}

      <div className="border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm p-4">
        <form onSubmit={handleFormSubmit} className="max-w-4xl mx-auto">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                placeholder={
                  !conversation
                    ? "Start a new conversation about cybersecurity..."
                    : "Ask about threats, incidents, or security analysis..."
                }
                className="min-h-[60px] max-h-[200px] resize-none bg-gray-800/50 border-gray-700 focus:border-green-500 text-white placeholder-gray-400 pr-12"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleFormSubmit(e)
                  }
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 bottom-2 h-8 w-8 p-0 text-gray-400 hover:text-green-400"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
            </div>

            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="h-[60px] px-6 bg-green-600 hover:bg-green-700 text-white"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>

          <FileUpload ref={fileInputRef} />
        </form>
      </div>
    </div>
  )
}
