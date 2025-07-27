"use client"

import { Button } from "@/components/ui/button"
import { Menu, Shield, Share, Settings } from "lucide-react"
import type { Conversation } from "@/types/conversation"

interface HeaderProps {
  onToggleSidebar: () => void
  currentConversation?: Conversation
}

export function Header({ onToggleSidebar, currentConversation }: HeaderProps) {
  return (
    <header className="border-b border-green-500/20 bg-gray-900/50 backdrop-blur-sm">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onToggleSidebar} className="text-green-400 hover:text-green-300">
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-green-400" />
            <div>
              <h2 className="text-lg font-semibold text-green-100">
                {currentConversation?.title || "OctopusX Security Intelligence"}
              </h2>
              <p className="text-xs text-green-400/70">AI-Powered SOC Assistant</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
