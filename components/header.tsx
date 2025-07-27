"use client"

import { Shield, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProviderIndicator } from "./provider-indicator"

interface HeaderProps {
  onNewConversation: () => void
}

export function Header({ onNewConversation }: HeaderProps) {
  return (
    <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-green-500" />
            <h1 className="text-xl font-bold text-white">OctopusX</h1>
          </div>
          <ProviderIndicator />
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={onNewConversation}
            variant="outline"
            size="sm"
            className="border-green-600/30 text-green-400 hover:bg-green-900/20 bg-transparent"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>
      </div>
    </header>
  )
}
