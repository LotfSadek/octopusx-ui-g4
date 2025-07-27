import type { Message } from "@ai-sdk/react"
import { MessageBubble } from "@/components/message-bubble"
import { LoadingMessage } from "@/components/loading-message"

interface MessageListProps {
  messages: Message[]
  isLoading: boolean
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      {isLoading && <LoadingMessage />}
    </div>
  )
}
