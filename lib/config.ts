export const LLM_CONFIG = {
  // Change this to switch between providers: 'openai' | 'langchain'
  provider: "openai" as "openai" | "langchain",

  // OpenAI Configuration
  openai: {
    model: "gpt-4o-mini",
    temperature: 0.7,
    maxTokens: 2000,
  },

  // Langchain Configuration
  langchain: {
    endpoint: process.env.LANGCHAIN_ENDPOINT || "http://localhost:8000/chat",
    timeout: 30000,
    streaming: true,
  },
}

export const APP_CONFIG = {
  name: "OctopusX",
  description: "Cybersecurity AI Assistant",
  version: "1.0.0",
}
