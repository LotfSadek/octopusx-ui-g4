import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages, conversationId, files } = await req.json()

    console.log("Chat API called with:", {
      messagesCount: messages?.length,
      conversationId,
      filesCount: files?.length,
    })

    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key not found")
      return Response.json({ error: "OpenAI API key not configured" }, { status: 500 })
    }

    console.log("Processing messages:", messages)

    const result = streamText({
      model: openai("gpt-4o-mini"),
      messages,
      temperature: 0.7,
      maxTokens: 2000,
      system: `You are OctopusX, an advanced cybersecurity AI assistant designed for SOC (Security Operations Center) operations. You specialize in:

- Threat detection and analysis
- Incident response guidance
- Security tool integration
- Vulnerability assessment
- Malware analysis
- Network security monitoring
- Compliance and risk assessment
- Log analysis and forensics
- Security automation and orchestration

Provide detailed, actionable cybersecurity insights and recommendations. Always prioritize security best practices and include relevant technical details when appropriate. When analyzing files or logs, focus on security implications, potential threats, and recommended mitigation strategies.

Respond in a professional, technical manner appropriate for SOC analysts and security professionals.`,
    })

    console.log("Streaming response created")
    return result.toDataStreamResponse({
      getErrorMessage: (error) => {
        console.error("Stream error:", error)
        return error instanceof Error ? error.message : "An error occurred"
      },
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return Response.json(
      {
        error: "Failed to process chat request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
