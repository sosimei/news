import { generateWithOllama } from "./ollama-client"

export interface BiasAnalysisResult {
  bias: string // 'left-leaning' | 'center-left' | 'center' | 'center-right' | 'right-leaning'
  biasScore: number // -2 (far left) to 2 (far right)
  biasAnalysis: string // 분석 설명
}

/**
 * Ollama를 사용하여 기사의 정치적 성향을 분석합니다.
 */
export async function analyzeArticleBias(title: string, content: string): Promise<BiasAnalysisResult> {
  try {
    const prompt = `
다음 뉴스 기사의 정치적 성향을 분석해주세요:

제목: ${title}

내용: ${content.substring(0, 1500)}...

다음 형식으로 응답해주세요:
1. 정치적 성향: "left-leaning"(좌파), "center-left"(중도좌파), "center"(중도), "center-right"(중도우파), "right-leaning"(우파) 중 하나
2. 성향 점수: -2(극좌)부터 2(극우)까지의 숫자, 소수점 한 자리까지
3. 분석 설명: 왜 이런 성향으로 판단했는지 간략한 설명

JSON 형식으로만 응답해주세요:
{
  "bias": "정치적 성향",
  "biasScore": 성향 점수,
  "biasAnalysis": "분석 설명"
}
`

    const response = await generateWithOllama(prompt, {
      model: "llama3.3:70b-instruct-q3_K_S",
      temperature: 0.6,
      maxTokens: 4096,
    })

    // JSON 응답 파싱
    try {
      // Ollama의 응답에서 JSON 부분 추출
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      const jsonStr = jsonMatch ? jsonMatch[0] : response

      const result = JSON.parse(jsonStr) as BiasAnalysisResult
      return result
    } catch (e) {
      console.error("Failed to parse AI response:", response)
      // 기본값 반환
      return {
        bias: "center",
        biasScore: 0,
        biasAnalysis: "분석 실패",
      }
    }
  } catch (error) {
    console.error("Error analyzing article bias:", error)
    return {
      bias: "center",
      biasScore: 0,
      biasAnalysis: "분석 중 오류 발생",
    }
  }
}

/**
 * Claude AI를 사용하여 기사의 정치적 성향을 분석합니다.
 * (Anthropic API 키가 필요합니다)
 */
export async function analyzeArticleBiasWithClaude(title: string, content: string): Promise<BiasAnalysisResult> {
  // Claude API 통합 코드는 여기에 구현
  // OpenAI와 유사한 방식으로 구현할 수 있습니다

  // 예시 구현:
  return {
    bias: "center",
    biasScore: 0,
    biasAnalysis: "Claude API 통합이 아직 구현되지 않았습니다.",
  }
}

