"use client"

import type { Message } from "@ai-sdk/react"
import { Shield, User, Copy, ThumbsUp, ThumbsDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user"

  const copyToClipboard = () => {
    const textContent = message.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("")
    navigator.clipboard.writeText(textContent)
  }

  return (
    <div className={cn("flex items-start space-x-4", isUser ? "flex-row-reverse space-x-reverse" : "")}>
      {/* Avatar */}
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isUser ? "bg-blue-600" : "bg-green-600 border border-green-500",
        )}
      >
        {isUser ? <User className="h-4 w-4 text-white" /> : <Shield className="h-4 w-4 text-white" />}
      </div>

      {/* Message Content */}
      <div className={cn("flex-1 max-w-3xl", isUser ? "text-right" : "")}>
        <div
          className={cn(
            "inline-block p-4 rounded-lg",
            isUser ? "bg-blue-600 text-white" : "bg-gray-800 border border-green-500/20 text-green-100",
          )}
        >
          {message.parts.map((part, index) => {
            if (part.type === "text") {
              return (
                <div key={index} className="whitespace-pre-wrap">
                  {part.text}
                </div>
              )
            }
            return null
          })}
        </div>

        {/* Message Actions */}
        {!isUser && (
          <div className="flex items-center space-x-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="sm" variant="ghost" onClick={copyToClipboard} className="text-green-400 hover:text-green-300">
              <Copy className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="ghost" className="text-green-400 hover:text-green-300">
              <ThumbsUp className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="ghost" className="text-green-400 hover:text-green-300">
              <ThumbsDown className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
