import { type NextRequest, NextResponse } from "next/server"
import { crawlAllNewsSources, crawlArticleContent, type CrawledArticle } from "@/lib/crawler"
import { analyzeArticleBias } from "@/lib/bias-analyzer"
import { saveArticle, initDataStore } from "@/lib/json-store"

// 데이터 저장소 초기화
initDataStore()

export async function GET(request: NextRequest) {
  // API 키 검증 (보안을 위해)
  const apiKey = request.nextUrl.searchParams.get("key")
  if (apiKey !== process.env.CRON_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Ollama 서버가 실행 중인지 확인
    try {
      const ollamaCheck = await fetch("http://localhost:11434/v1/models", {
        headers: {
          Authorization: "Bearer ollama",
        },
      })

      if (!ollamaCheck.ok) {
        return NextResponse.json(
          {
            error: "Ollama 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인하세요.",
          },
          { status: 500 },
        )
      }
    } catch (error) {
      return NextResponse.json(
        {
          error: "Ollama 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인하세요.",
        },
        { status: 500 },
      )
    }

    // 모든 뉴스 소스에서 기사 크롤링
    const articles = await crawlAllNewsSources()
    console.log(`Crawled ${articles.length} articles`)

    // 각 기사 처리
    const results = await Promise.all(
      articles.map(async (article) => {
        try {
          // 기사 전체 내용 크롤링
          const content = await crawlArticleContent(article)
          article.content = content

          // 기사 정치적 성향 분석
          if (content) {
            const biasResult = await analyzeArticleBias(article.title, content)

            // 분석 결과를 기사 객체에 추가
            const enrichedArticle: CrawledArticle & {
              bias: string
              biasScore: number
              biasAnalysis: string
            } = {
              ...article,
              bias: biasResult.bias,
              biasScore: biasResult.biasScore,
              biasAnalysis: biasResult.biasAnalysis,
            }

            // JSON 파일에 저장
            await saveArticle(enrichedArticle)
            return { success: true, article: enrichedArticle.title }
          }

          // 내용이 없는 경우 기본 정보만 저장
          await saveArticle(article)
          return { success: true, article: article.title, note: "No content" }
        } catch (error) {
          console.error(`Error processing article ${article.title}:`, error)
          return { success: false, article: article.title, error: String(error) }
        }
      }),
    )

    return NextResponse.json({
      success: true,
      processed: results.length,
      results,
    })
  } catch (error) {
    console.error("Error in cron job:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

