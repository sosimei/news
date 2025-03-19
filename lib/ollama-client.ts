interface OllamaGenerateRequest {
  model: string
  prompt: string
  stream?: boolean
  options?: {
    temperature?: number
    top_p?: number
    top_k?: number
    num_predict?: number
  }
}

interface OllamaGenerateResponse {
  model: string
  created_at: string
  response: string
  done: boolean
}

export async function generateWithOllama(
  prompt: string,
  options: {
    model?: string
    temperature?: number
    maxTokens?: number
  } = {},
): Promise<string> {
  const { model = "llama3.3:70b-instruct-q3_K_S", temperature = 0.6, maxTokens = 4096 } = options

  try {
    const response = await fetch("http://localhost:11434/v1/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer ollama", // 설정에 맞게 API 키 사용
      },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        options: {
          temperature,
          num_predict: maxTokens,
        },
      } as OllamaGenerateRequest),
    })

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`)
    }

    const data = (await response.json()) as OllamaGenerateResponse
    return data.response
  } catch (error) {
    console.error("Error calling Ollama API:", error)
    throw error
  }
}

