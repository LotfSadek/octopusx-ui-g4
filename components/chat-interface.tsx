"use client"

import type React from "react"
import { useChat } from "ai/react"
import { useEffect, useRef, useState } from "react"
import { MessageList } from "./message-list"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Paperclip, Shield, AlertTriangle, Search, Database } from "lucide-react"
import { FileUpload } from "./file-upload"
import type { Conversation } from "@/types/conversation"

interface ChatInterfaceProps {
  conversationId: string | null
  onUpdateTitle: (id: string, title: string) => void
  onCreateConversation: (firstMessage: string) => string
  conversations: Conversation[]
  setConversations: (conversations: Conversation[]) => void
}

export function ChatInterface({
  conversationId,
  onUpdateTitle,
  onCreateConversation,
  conversations,
  setConversations,
}: ChatInterfaceProps) {
  const [showFileUpload, setShowFileUpload] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [chatError, setChatError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: "/api/chat",
    body: {
      conversationId,
      files: uploadedFiles.map((file) => ({
        name: file.name,
        type: file.type,
        size: file.size,
      })),
    },
    onFinish: (message) => {
      console.log("Message finished:", message)
      setChatError(null)
      if (conversationId && messages.length === 0) {
        const title = input.slice(0, 50) + (input.length > 50 ? "..." : "")
        onUpdateTitle(conversationId, title)
      }
    },
    onError: (error) => {
      console.error("Chat error details:", error)
      setChatError(error.message || "An error occurred while processing your request")
    },
  })

  useEffect(() => {
    console.log("Messages updated:", messages)
  }, [messages])

  useEffect(() => {
    console.log("Loading state:", isLoading)
  }, [isLoading])

  const handleCustomSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    console.log("Form submitted with input:", input)
    setChatError(null)

    if (!input.trim() && uploadedFiles.length === 0) {
      console.log("No input or files, returning")
      return
    }

    if (!conversationId) {
      console.log("Creating new conversation")
      const newConversationId = onCreateConversation(input.trim() || "File Analysis")
      console.log("New conversation created:", newConversationId)
      return
    }

    console.log("Submitting to existing conversation:", conversationId)
    handleSubmit(e)
  }

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"
    }
  }, [input])

  useEffect(() => {
    if (conversationId && input.trim() && messages.length === 0) {
      console.log("Auto-submitting after conversation creation")
      setTimeout(() => {
        const form = document.querySelector("form") as HTMLFormElement
        if (form) {
          handleSubmit(new Event("submit") as any)
        }
      }, 100)
    }
  }, [conversationId, input, messages.length, handleSubmit])

  const handleFileUpload = (files: File[]) => {
    setUploadedFiles((prev) => [...prev, ...files])
    setShowFileUpload(false)
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const quickPrompts = [
    {
      icon: Shield,
      title: "Threat Analysis",
      prompt: "Analyze the latest security threats and provide mitigation strategies",
    },
    {
      icon: AlertTriangle,
      title: "Incident Response",
      prompt: "Help me create an incident response plan for a potential data breach",
    },
    {
      icon: Search,
      title: "Log Analysis",
      prompt: "Analyze these security logs for suspicious activities and patterns",
    },
    {
      icon: Database,
      title: "Vulnerability Assessment",
      prompt: "Perform a vulnerability assessment on the provided system information",
    },
  ]

  const handleQuickPrompt = (prompt: string) => {
    console.log("Quick prompt clicked:", prompt)
    setChatError(null)
    if (!conversationId) {
      onCreateConversation(prompt)
    }
    handleInputChange({ target: { value: prompt } } as any)
  }

  const showWelcome = !conversationId && messages.length === 0

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <ScrollArea className="flex-1 p-4">
        {showWelcome ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-4xl mx-auto p-8">
              <div className="flex items-center justify-center mb-6">
                <Shield className="h-16 w-16 text-green-500 animate-pulse" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">Welcome to OctopusX</h1>
              <p className="text-xl text-gray-400 mb-2">Your Advanced Cybersecurity AI Assistant</p>
              <p className="text-sm text-gray-500 mb-8">Powered by OpenAI • Ready for SOC Operations</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
                {quickPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-6 border-green-600/30 hover:border-green-500/50 hover:bg-green-900/20 text-left flex flex-col items-start gap-3 transition-all duration-200 bg-transparent"
                    onClick={() => handleQuickPrompt(prompt.prompt)}
                  >
                    <prompt.icon className="h-6 w-6 text-green-500" />
                    <div className="w-full">
                      <div className="font-semibold text-white mb-1">{prompt.title}</div>
                      <div className="text-sm text-gray-400 line-clamp-2">{prompt.prompt}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <MessageList messages={messages} isLoading={isLoading} />
        )}
      </ScrollArea>

      {(error || chatError) && (
        <div className="mx-4 mb-2 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
          <div className="font-semibold mb-1">Error:</div>
          <div>{chatError || error?.message || "An unknown error occurred"}</div>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 text-red-400 hover:text-red-300"
            onClick={() => setChatError(null)}
          >
            Dismiss
          </Button>
        </div>
      )}

      <div className="border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm p-4">
        {showFileUpload && (
          <div className="mb-4">
            <FileUpload onFileUpload={handleFileUpload} />
          </div>
        )}

        {uploadedFiles.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 bg-green-600/20 border border-green-500/30 rounded-lg px-3 py-2"
              >
                <Paperclip className="h-4 w-4 text-green-400" />
                <span className="text-sm text-green-100">{file.name}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeFile(index)}
                  className="h-4 w-4 p-0 text-red-400 hover:text-red-300"
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleCustomSubmit} className="max-w-4xl mx-auto">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                placeholder={
                  showWelcome
                    ? "Start a new conversation about cybersecurity..."
                    : "Ask about threats, incidents, or security analysis..."
                }
                className="min-h-[60px] max-h-[200px] resize-none bg-gray-800/50 border-gray-700 focus:border-green-500 text-white placeholder-gray-400 pr-12"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleCustomSubmit(e as any)
                  }
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 bottom-2 h-8 w-8 p-0 text-gray-400 hover:text-green-400"
                onClick={() => setShowFileUpload(!showFileUpload)}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
            </div>

            <Button
              type="submit"
              disabled={(!input.trim() && uploadedFiles.length === 0) || isLoading}
              className="h-[60px] px-6 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
        </form>

        <div className="mt-2 text-xs text-gray-500 text-center max-w-4xl mx-auto">
          {showWelcome
            ? "Start your first security analysis conversation"
            : "OctopusX can analyze security logs, PDFs, and provide threat intelligence"}
        </div>
      </div>
    </div>
  )
}
