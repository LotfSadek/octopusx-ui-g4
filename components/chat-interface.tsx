"use client"

import type React from "react"

import { useChat } from "@ai-sdk/react"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageList } from "@/components/message-list"
import { FileUpload } from "@/components/file-upload"
import { Send, Paperclip, Zap, Shield, AlertTriangle, Activity } from "lucide-react"
import type { Conversation } from "@/types/conversation"
import { cn } from "@/lib/utils"

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
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
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
      // Update conversation title if it's the first message
      if (conversationId && messages.length === 0) {
        const title = input.slice(0, 50) + (input.length > 50 ? "..." : "")
        onUpdateTitle(conversationId, title)
      }
    },
  })

  // Custom submit handler to create conversation if needed
  const handleCustomSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!input.trim() && uploadedFiles.length === 0) return

    // If no conversation exists, create one
    if (!conversationId) {
      onCreateConversation(input.trim() || "File Analysis")
      return
    }

    // Normal submit
    handleSubmit(e)
  }

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"
    }
  }, [input])

  // Auto-submit when conversation is created
  useEffect(() => {
    if (conversationId && input.trim() && messages.length === 0) {
      // Small delay to ensure the conversation is properly set up
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
      icon: Activity,
      title: "Log Analysis",
      prompt: "Analyze these security logs for suspicious activities and patterns",
    },
    {
      icon: Zap,
      title: "Vulnerability Assessment",
      prompt: "Perform a vulnerability assessment on the provided system information",
    },
  ]

  const handleQuickPrompt = (prompt: string) => {
    if (!conversationId) {
      onCreateConversation(prompt)
    }
    // Set the input and let the useEffect handle submission
    handleInputChange({ target: { value: prompt } } as any)
  }

  const showWelcome = !conversationId && messages.length === 0

  return (
    <div className="flex-1 flex flex-col">
      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        {showWelcome ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-2xl mx-auto p-8">
              <Shield className="h-16 w-16 text-green-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-green-100 mb-4">Welcome to OctopusX</h2>
              <p className="text-green-400/70 mb-8">
                Your AI-powered Security Operations Center assistant. Start typing below or choose a quick prompt to
                begin analyzing threats, incidents, and security data.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="p-6 h-auto flex flex-col items-start space-y-2 border-green-500/30 hover:border-green-500/50 hover:bg-green-600/10 bg-transparent"
                    onClick={() => handleQuickPrompt(prompt.prompt)}
                  >
                    <prompt.icon className="h-6 w-6 text-green-400" />
                    <div className="text-left">
                      <div className="font-semibold text-green-100">{prompt.title}</div>
                      <div className="text-sm text-green-400/70">{prompt.prompt}</div>
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

      {/* Input Area */}
      <div className="border-t border-green-500/20 bg-gray-900/50 backdrop-blur-sm p-4">
        {/* File Upload Area */}
        {showFileUpload && (
          <div className="mb-4">
            <FileUpload onFileUpload={handleFileUpload} />
          </div>
        )}

        {/* Uploaded Files */}
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

        <form onSubmit={handleCustomSubmit} className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              placeholder={
                showWelcome
                  ? "Ask me about security threats, analyze logs, or upload files..."
                  : "Describe your security concern or upload files for analysis..."
              }
              className="min-h-[60px] max-h-[200px] resize-none bg-gray-800 border-green-500/30 focus:border-green-500 text-green-100 placeholder:text-green-400/50"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleCustomSubmit(e as any)
                }
              }}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowFileUpload(!showFileUpload)}
              className={cn("border-green-500/30 hover:border-green-500/50", showFileUpload && "bg-green-600/20")}
            >
              <Paperclip className="h-4 w-4" />
            </Button>

            <Button
              type="submit"
              disabled={isLoading || (!input.trim() && uploadedFiles.length === 0)}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>

        <div className="mt-2 text-xs text-green-400/50 text-center">
          {showWelcome
            ? "Start your first security analysis conversation"
            : "OctopusX can analyze security logs, PDFs, and provide threat intelligence"}
        </div>
      </div>
    </div>
  )
}
