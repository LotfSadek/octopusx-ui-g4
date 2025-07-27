"use client"
import { MessageBubble } from "./message-bubble"
import { LoadingMessage } from "./loading-message"
import type { Message } from "ai"

interface MessageListProps {
  messages: Message[]
  isLoading: boolean
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  return (
    <div className="space-y-4 max-w-4xl mx-auto w-full">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      {isLoading && <LoadingMessage />}
    </div>
  )
}
