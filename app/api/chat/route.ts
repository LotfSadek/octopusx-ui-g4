import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"
import { LLM_CONFIG } from "@/lib/config"

export async function POST(req: Request) {
  try {
    const { messages, files } = await req.json()

    if (LLM_CONFIG.provider === "openai") {
      // OpenAI Integration
      const result = streamText({
        model: openai(LLM_CONFIG.openai.model),
        messages,
        temperature: LLM_CONFIG.openai.temperature,
        maxTokens: LLM_CONFIG.openai.maxTokens,
        system: `You are OctopusX, an advanced cybersecurity AI assistant designed for SOC (Security Operations Center) operations. You specialize in:

- Threat detection and analysis
- Incident response guidance
- Security tool integration
- Vulnerability assessment
- Malware analysis
- Network security monitoring
- Compliance and risk assessment

Provide detailed, actionable cybersecurity insights and recommendations. Always prioritize security best practices and include relevant technical details when appropriate.`,
      })

      return result.toDataStreamResponse()
    } else {
      // Langchain Integration
      const response = await fetch(LLM_CONFIG.langchain.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.LANGCHAIN_API_KEY}`,
        },
        body: JSON.stringify({
          messages: messages.map((msg: any) => ({
            role: msg.role,
            content: msg.content,
          })),
          files: files || [],
          stream: LLM_CONFIG.langchain.streaming,
        }),
        signal: AbortSignal.timeout(LLM_CONFIG.langchain.timeout),
      })

      if (!response.ok) {
        throw new Error(`Langchain API error: ${response.status}`)
      }

      if (LLM_CONFIG.langchain.streaming) {
        // Return streaming response
        return new Response(response.body, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
          },
        })
      } else {
        // Return non-streaming response
        const data = await response.json()
        return Response.json({ content: data.response })
      }
    }
  } catch (error) {
    console.error("Chat API error:", error)
    return Response.json({ error: "Failed to process chat request" }, { status: 500 })
  }
}
