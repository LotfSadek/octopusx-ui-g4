"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Shield } from "lucide-react"

export function LoadingMessage() {
  return (
    <div className="flex gap-4 justify-start">
      <Avatar className="h-8 w-8 border-2 border-green-500/30">
        <AvatarFallback className="bg-green-900/50 text-green-400">
          <Shield className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>

      <div className="max-w-[80%] rounded-lg p-4 bg-gray-800/50 border border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          </div>
          <span className="text-sm text-gray-400">OctopusX is analyzing...</span>
        </div>
      </div>
    </div>
  )
}
