import { LLM_CONFIG } from "@/lib/config"
import { Badge } from "@/components/ui/badge"

export function ProviderIndicator() {
  return (
    <Badge variant="outline" className="text-xs border-green-600/30 text-green-400">
      {LLM_CONFIG.provider === "openai" ? "OpenAI" : "Langchain"}
    </Badge>
  )
}
