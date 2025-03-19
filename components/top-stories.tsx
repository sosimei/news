import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { NewsCard } from "@/components/news-card"
import type { StoredArticle } from "@/lib/json-store"

interface TopStoriesProps {
  articles: StoredArticle[]
}

export function TopStories({ articles }: TopStoriesProps) {
  // 가장 많이 다루어진 주제를 찾기 위해 제목 유사성 분석
  // 실제로는 더 복잡한 알고리즘이 필요하지만, 여기서는 간단히 구현
  const mainStory = articles[0] // 임시로 첫 번째 기사를 메인 스토리로 설정

  // 다양한 관점의 기사 선택 (다른 언론사, 다른 정치적 성향)
  const diversePerspectives = articles
    .filter((article) => article.id !== mainStory.id && article.source !== mainStory.source)
    .slice(0, 4)

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full lg:col-span-2">
          <CardHeader>
            <CardTitle>Today's Top Story</CardTitle>
            <CardDescription>Coverage from multiple perspectives</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="aspect-video w-full overflow-hidden rounded-lg">
                <img
                  src="/placeholder.svg?height=400&width=800"
                  alt="Main news story"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h2 className="mb-2 text-2xl font-bold">{mainStory.title}</h2>
                <p className="text-muted-foreground">
                  {mainStory.description || mainStory.content?.substring(0, 200) + "..."}
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {diversePerspectives.map((article, index) => (
                  <div key={index} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{article.source}</span>
                      <span className={`text-xs ${getBiasTextColor(article.bias || "center")}`}>
                        {getBiasLabel(article.bias || "center")}
                      </span>
                    </div>
                    <p className="mt-2 text-sm">"{article.title}"</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Media Bias Guide</CardTitle>
            <CardDescription>Understanding news source perspectives</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Left-Leaning</span>
                <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">한겨레, 경향신문</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div className="h-2 w-[20%] rounded-full bg-blue-500"></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Center-Left</span>
                <span className="rounded bg-sky-100 px-2 py-1 text-xs text-sky-800">오마이뉴스, 프레시안</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div className="h-2 w-[20%] rounded-full bg-sky-500" style={{ marginLeft: "20%" }}></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Center</span>
                <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-800">중앙일보, 한국일보</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div className="h-2 w-[20%] rounded-full bg-gray-500" style={{ marginLeft: "40%" }}></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Center-Right</span>
                <span className="rounded bg-amber-100 px-2 py-1 text-xs text-amber-800">동아일보, 매일경제</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div className="h-2 w-[20%] rounded-full bg-amber-500" style={{ marginLeft: "60%" }}></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Right-Leaning</span>
                <span className="rounded bg-red-100 px-2 py-1 text-xs text-red-800">조선일보, 중앙일보</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div className="h-2 w-[20%] rounded-full bg-red-500" style={{ marginLeft: "80%" }}></div>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                이 분류는 일반적인 경향을 나타내며, 개별 기사는 다를 수 있습니다. 항상 다양한 출처의 뉴스를 읽는 것이
                좋습니다.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <h2 className="text-2xl font-bold">More Top Stories</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.slice(1, 7).map((article, index) => (
          <NewsCard
            key={index}
            title={article.title}
            description={article.description || article.content?.substring(0, 150) + "..."}
            source={article.source}
            date={new Date(article.publishedAt).toLocaleDateString("ko-KR")}
            imageUrl="/placeholder.svg?height=200&width=400"
            bias={article.bias || "center"}
          />
        ))}
      </div>
    </div>
  )
}

// 정치적 성향에 따른 텍스트 색상 반환
function getBiasTextColor(bias: string): string {
  switch (bias) {
    case "left-leaning":
      return "text-blue-600"
    case "center-left":
      return "text-sky-600"
    case "center":
      return "text-gray-600"
    case "center-right":
      return "text-amber-600"
    case "right-leaning":
      return "text-red-600"
    default:
      return "text-gray-600"
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

