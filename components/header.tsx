"use client"

import { Button } from "@/components/ui/button"
import { Menu, Shield } from "lucide-react"

interface HeaderProps {
  onToggleSidebar: () => void
}

export function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-green-500" />
            <h1 className="text-xl font-bold">OctopusX</h1>
            <span className="text-xs bg-green-600/20 text-green-400 px-2 py-1 rounded-full">OpenAI</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="text-sm text-gray-400">SOC Intelligence Platform</div>
        </div>
      </div>
    </header>
  )
}
