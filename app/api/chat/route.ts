import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages, conversationId, files } = await req.json()

    // Add system prompt for cybersecurity context
    const systemPrompt = `You are OctopusX, an advanced AI assistant specialized in cybersecurity and Security Operations Center (SOC) operations. You have expertise in:

- Threat analysis and intelligence
- Incident response and forensics
- Vulnerability assessment and management
- Security log analysis
- Malware analysis
- Network security monitoring
- Compliance and risk assessment
- Security tool integration and automation

You can analyze uploaded security documents, logs, and reports. Always provide actionable insights and follow cybersecurity best practices. When analyzing files, focus on security implications, potential threats, and recommended actions.

Respond in a professional, technical manner appropriate for SOC analysts and security professionals.`

    const result = streamText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      messages,
      temperature: 0.7,
      maxTokens: 2000,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
