import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { StoredArticle } from "@/lib/json-store"

interface NewsSourcesComparisonProps {
  articles: StoredArticle[]
}

export function NewsSourcesComparison({ articles }: NewsSourcesComparisonProps) {
  // 보수 언론 기사 필터링
  const conservativeArticles = articles
    .filter((article) => article.bias === "right-leaning" || article.bias === "center-right")
    .slice(0, 2)

  // 중도 언론 기사 필터링
  const centristArticles = articles.filter((article) => article.bias === "center").slice(0, 2)

  // 진보 언론 기사 필터링
  const progressiveArticles = articles
    .filter((article) => article.bias === "left-leaning" || article.bias === "center-left")
    .slice(0, 2)

  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-4">
        <h3 className="text-xl font-bold">주요 이슈: 최저임금 인상 논란</h3>
        <p className="text-sm text-muted-foreground">
          정부가 발표한 최저임금 인상안에 대한 다양한 언론사의 보도를 비교합니다.
        </p>
      </div>
      <Tabs defaultValue="conservative">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="conservative">보수 언론</TabsTrigger>
          <TabsTrigger value="centrist">중도 언론</TabsTrigger>
          <TabsTrigger value="progressive">진보 언론</TabsTrigger>
        </TabsList>
        <TabsContent value="conservative" className="mt-4 space-y-4">
          {conservativeArticles.length > 0 ? (
            conservativeArticles.map((article, index) => (
              <div key={index} className="rounded-lg border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-bold">{article.source}</h4>
                  <span
                    className={`rounded px-2 py-1 text-xs ${getBiasBackgroundColor(article.bias || "center-right")}`}
                  >
                    {getBiasLabel(article.bias || "center-right")}
                  </span>
                </div>
                <h5 className="mb-2 font-medium">"{article.title}"</h5>
                <p className="text-sm text-muted-foreground">
                  {article.description || article.content?.substring(0, 200) + "..."}
                </p>
                <div className="mt-2 flex items-center text-xs text-muted-foreground">
                  <span>{new Date(article.publishedAt).toLocaleDateString("ko-KR")}</span>
                  <span className="mx-2">•</span>
                  <span>{article.category || "일반"}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-lg border p-4 text-center text-muted-foreground">
              보수 언론 기사가 아직 수집되지 않았습니다.
            </div>
          )}
        </TabsContent>
        <TabsContent value="centrist" className="mt-4 space-y-4">
          {centristArticles.length > 0 ? (
            centristArticles.map((article, index) => (
              <div key={index} className="rounded-lg border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-bold">{article.source}</h4>
                  <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-800">
                    {getBiasLabel(article.bias || "center")}
                  </span>
                </div>
                <h5 className="mb-2 font-medium">"{article.title}"</h5>
                <p className="text-sm text-muted-foreground">
                  {article.description || article.content?.substring(0, 200) + "..."}
                </p>
                <div className="mt-2 flex items-center text-xs text-muted-foreground">
                  <span>{new Date(article.publishedAt).toLocaleDateString("ko-KR")}</span>
                  <span className="mx-2">•</span>
                  <span>{article.category || "일반"}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-lg border p-4 text-center text-muted-foreground">
              중도 언론 기사가 아직 수집되지 않았습니다.
            </div>
          )}
        </TabsContent>
        <TabsContent value="progressive" className="mt-4 space-y-4">
          {progressiveArticles.length > 0 ? (
            progressiveArticles.map((article, index) => (
              <div key={index} className="rounded-lg border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-bold">{article.source}</h4>
                  <span
                    className={`rounded px-2 py-1 text-xs ${getBiasBackgroundColor(article.bias || "center-left")}`}
                  >
                    {getBiasLabel(article.bias || "center-left")}
                  </span>
                </div>
                <h5 className="mb-2 font-medium">"{article.title}"</h5>
                <p className="text-sm text-muted-foreground">
                  {article.description || article.content?.substring(0, 200) + "..."}
                </p>
                <div className="mt-2 flex items-center text-xs text-muted-foreground">
                  <span>{new Date(article.publishedAt).toLocaleDateString("ko-KR")}</span>
                  <span className="mx-2">•</span>
                  <span>{article.category || "일반"}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-lg border p-4 text-center text-muted-foreground">
              진보 언론 기사가 아직 수집되지 않았습니다.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

// 정치적 성향에 따른 배경색 반환
function getBiasBackgroundColor(bias: string): string {
  switch (bias) {
    case "left-leaning":
      return "bg-blue-100 text-blue-800"
    case "center-left":
      return "bg-sky-100 text-sky-800"
    case "center":
      return "bg-gray-100 text-gray-800"
    case "center-right":
      return "bg-amber-100 text-amber-800"
    case "right-leaning":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

// 정치적 성향 한글 라벨 반환
function getBiasLabel(bias: string): string {
  switch (bias) {
    case "left-leaning":
      return "좌측 성향"
    case "center-left":
      return "중도좌파"
    case "center":
      return "중도"
    case "center-right":
      return "중도우파"
    case "right-leaning":
      return "우측 성향"
    default:
      return "중도"
  }
}

