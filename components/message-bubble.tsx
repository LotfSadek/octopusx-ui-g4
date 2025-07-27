"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Copy, ThumbsUp, ThumbsDown, User, Shield } from "lucide-react"
import { useState } from "react"
import type { Message } from "ai"

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isUser = message.role === "user"

  return (
    <div className={`flex gap-4 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <Avatar className="h-8 w-8 border-2 border-green-500/30">
          <AvatarFallback className="bg-green-900/50 text-green-400">
            <Shield className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={`max-w-[80%] rounded-lg p-4 ${
          isUser ? "bg-green-600 text-white ml-auto" : "bg-gray-800/50 text-gray-100 border border-gray-700"
        }`}
      >
        <div className="prose prose-invert max-w-none">
          <div className="whitespace-pre-wrap break-words overflow-wrap-anywhere min-w-0 max-w-full">
            {message.content}
          </div>
        </div>

        {!isUser && (
          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-700">
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="h-6 px-2 text-xs text-gray-400 hover:text-green-400"
            >
              <Copy className="h-3 w-3 mr-1" />
              {copied ? "Copied!" : "Copy"}
            </Button>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-gray-400 hover:text-green-400">
              <ThumbsUp className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-gray-400 hover:text-red-400">
              <ThumbsDown className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {isUser && (
        <Avatar className="h-8 w-8 border-2 border-green-500/30">
          <AvatarFallback className="bg-green-900/50 text-green-400">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}
