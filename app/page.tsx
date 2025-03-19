import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NewsCard } from "@/components/news-card"
import { TopStories } from "@/components/top-stories"
import { NewsSourcesComparison } from "@/components/news-sources-comparison"
import { PoliticalSpectrum } from "@/components/political-spectrum"
import { Search } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight">뉴스 비교 | News Compare</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search news..."
                className="w-full rounded-md border border-input bg-background py-2 pl-8 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <Button>Sign In</Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="container py-6">
          <Tabs defaultValue="top-stories" className="w-full">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="top-stories">Top Stories</TabsTrigger>
                <TabsTrigger value="politics">Politics</TabsTrigger>
                <TabsTrigger value="business">Business</TabsTrigger>
                <TabsTrigger value="technology">Technology</TabsTrigger>
                <TabsTrigger value="entertainment">Entertainment</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  All Sources
                </Button>
                <Button variant="outline" size="sm">
                  Filter
                </Button>
              </div>
            </div>
            <TabsContent value="top-stories" className="mt-6">
              <TopStories />
            </TabsContent>
            <TabsContent value="politics" className="mt-6">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Political Coverage Comparison</CardTitle>
                    <CardDescription>
                      See how different Korean news outlets cover the same political stories
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PoliticalSpectrum />
                  </CardContent>
                </Card>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <NewsCard
                    title="국회, 새로운 법안 통과에 대한 논쟁"
                    description="여야 간의 첨예한 대립 속에서 새 법안이 통과되었습니다."
                    source="조선일보"
                    date="2025년 3월 19일"
                    imageUrl="/placeholder.svg?height=200&width=400"
                    bias="right-leaning"
                  />
                  <NewsCard
                    title="새 법안 통과, 국민 생활에 미치는 영향은?"
                    description="새롭게 통과된 법안이 일반 시민들의 삶에 어떤 변화를 가져올지 분석합니다."
                    source="한겨레"
                    date="2025년 3월 19일"
                    imageUrl="/placeholder.svg?height=200&width=400"
                    bias="left-leaning"
                  />
                  <NewsCard
                    title="법안 통과 후 경제 전문가들의 반응"
                    description="새 법안에 대한 다양한 경제 전문가들의 의견을 종합했습니다."
                    source="중앙일보"
                    date="2025년 3월 19일"
                    imageUrl="/placeholder.svg?height=200&width=400"
                    bias="center"
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="business" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <NewsCard
                  title="삼성전자, 신규 투자 계획 발표"
                  description="삼성전자가 반도체 사업에 대규모 투자를 결정했습니다."
                  source="매일경제"
                  date="2025년 3월 19일"
                  imageUrl="/placeholder.svg?height=200&width=400"
                  bias="center-right"
                />
                <NewsCard
                  title="원화 가치 상승, 수출 기업에 미치는 영향"
                  description="최근 원화 강세가 한국 수출 기업들에게 어떤 영향을 미치는지 살펴봅니다."
                  source="한국경제"
                  date="2025년 3월 19일"
                  imageUrl="/placeholder.svg?height=200&width=400"
                  bias="center-right"
                />
                <NewsCard
                  title="중소기업 지원 정책 효과 분석"
                  description="정부의 중소기업 지원 정책이 실제로 어떤 효과를 내고 있는지 조사했습니다."
                  source="경향신문"
                  date="2025년 3월 19일"
                  imageUrl="/placeholder.svg?height=200&width=400"
                  bias="center-left"
                />
              </div>
            </TabsContent>
            <TabsContent value="technology" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <NewsCard
                  title="한국 AI 기업들의 글로벌 경쟁력"
                  description="국내 AI 스타트업들이 세계 시장에서 어떻게 경쟁하고 있는지 알아봅니다."
                  source="디지털타임스"
                  date="2025년 3월 19일"
                  imageUrl="/placeholder.svg?height=200&width=400"
                  bias="center"
                />
                <NewsCard
                  title="5G 네트워크 확장, 농촌 지역까지"
                  description="통신사들이 농촌 지역까지 5G 서비스를 확대하는 계획을 발표했습니다."
                  source="전자신문"
                  date="2025년 3월 19일"
                  imageUrl="/placeholder.svg?height=200&width=400"
                  bias="center"
                />
                <NewsCard
                  title="디지털 프라이버시 관련 새 규제 논의"
                  description="개인정보 보호를 위한 새로운 규제에 대한 찬반 의견을 정리했습니다."
                  source="오마이뉴스"
                  date="2025년 3월 19일"
                  imageUrl="/placeholder.svg?height=200&width=400"
                  bias="left-leaning"
                />
              </div>
            </TabsContent>
            <TabsContent value="entertainment" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <NewsCard
                  title="신작 드라마 시청률 돌파"
                  description="새롭게 방영된 드라마가 첫 회부터 높은 시청률을 기록했습니다."
                  source="스포츠조선"
                  date="2025년 3월 19일"
                  imageUrl="/placeholder.svg?height=200&width=400"
                  bias="center"
                />
                <NewsCard
                  title="K-POP 그룹, 미국 빌보드 차트 진입"
                  description="한국의 아이돌 그룹이 또다시 빌보드 차트에 이름을 올렸습니다."
                  source="스타뉴스"
                  date="2025년 3월 19일"
                  imageUrl="/placeholder.svg?height=200&width=400"
                  bias="center"
                />
                <NewsCard
                  title="국제 영화제에서 한국 영화 수상"
                  description="한국 독립 영화가 국제 영화제에서 주요 상을 수상했습니다."
                  source="씨네21"
                  date="2025년 3월 19일"
                  imageUrl="/placeholder.svg?height=200&width=400"
                  bias="center-left"
                />
              </div>
            </TabsContent>
          </Tabs>
        </section>
        <section className="container py-6">
          <Card>
            <CardHeader>
              <CardTitle>Featured Story Comparison</CardTitle>
              <CardDescription>See how different news sources cover the same major story</CardDescription>
            </CardHeader>
            <CardContent>
              <NewsSourcesComparison />
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View More Comparisons
              </Button>
            </CardFooter>
          </Card>
        </section>
      </main>
      <footer className="border-t bg-muted">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:justify-between">
          <div>
            <h2 className="text-lg font-bold">뉴스 비교 | News Compare</h2>
            <p className="text-sm text-muted-foreground">Comparing news coverage across Korean media outlets</p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">About</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Our Mission
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Methodology
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Team
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Sources</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    News Outlets
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Bias Ratings
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Suggest a Source
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Legal</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="container py-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} News Compare. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

