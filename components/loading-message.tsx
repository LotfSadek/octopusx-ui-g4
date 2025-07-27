import { Shield } from "lucide-react"

export function LoadingMessage() {
  return (
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 border border-green-500 flex items-center justify-center">
        <Shield className="h-4 w-4 text-white" />
      </div>

      <div className="flex-1 max-w-3xl">
        <div className="inline-block p-4 rounded-lg bg-gray-800 border border-green-500/20">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
            </div>
            <span className="text-green-400 text-sm">Analyzing security data...</span>
          </div>
        </div>
      </div>
    </div>
  )
}
