import fs from "fs"
import path from "path"
import type { CrawledArticle } from "./crawler"
import type { BiasAnalysisResult } from "./bias-analyzer"

// 데이터 저장 디렉토리
const DATA_DIR = path.join(process.cwd(), "data")
const ARTICLES_FILE = path.join(DATA_DIR, "articles.json")
const STATS_FILE = path.join(DATA_DIR, "stats.json")

// 데이터 타입 정의
export interface StoredArticle extends CrawledArticle, Partial<BiasAnalysisResult> {
  id: string
  createdAt: string
}

export interface ArticleStats {
  source: string
  bias: string
  count: number
  lastUpdated: string
}

// 데이터 디렉토리 초기화
export function initDataStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }

  if (!fs.existsSync(ARTICLES_FILE)) {
    fs.writeFileSync(ARTICLES_FILE, JSON.stringify([]))
  }

  if (!fs.existsSync(STATS_FILE)) {
    fs.writeFileSync(STATS_FILE, JSON.stringify([]))
  }
}

// 모든 기사 가져오기
export function getArticles(
  limit = 20,
  offset = 0,
  filters: { source?: string; bias?: string; category?: string } = {},
): StoredArticle[] {
  try {
    if (!fs.existsSync(ARTICLES_FILE)) {
      return []
    }

    const data = fs.readFileSync(ARTICLES_FILE, "utf-8")
    let articles: StoredArticle[] = JSON.parse(data)

    // 필터 적용
    if (filters.source) {
      articles = articles.filter((article) => article.source === filters.source)
    }

    if (filters.bias) {
      articles = articles.filter((article) => article.bias === filters.bias)
    }

    if (filters.category) {
      articles = articles.filter((article) => article.category === filters.category)
    }

    // 날짜 기준 내림차순 정렬
    articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

    // 페이지네이션 적용
    return articles.slice(offset, offset + limit)
  } catch (error) {
    console.error("Error reading articles:", error)
    return []
  }
}

// 특정 ID의 기사 가져오기
export function getArticleById(id: string): StoredArticle | null {
  try {
    if (!fs.existsSync(ARTICLES_FILE)) {
      return null
    }

    const data = fs.readFileSync(ARTICLES_FILE, "utf-8")
    const articles: StoredArticle[] = JSON.parse(data)

    return articles.find((article) => article.id === id) || null
  } catch (error) {
    console.error("Error reading article by ID:", error)
    return null
  }
}

// 기사 저장하기
export function saveArticle(article: CrawledArticle & Partial<BiasAnalysisResult>): StoredArticle {
  try {
    initDataStore()

    const data = fs.existsSync(ARTICLES_FILE) ? fs.readFileSync(ARTICLES_FILE, "utf-8") : "[]"

    const articles: StoredArticle[] = JSON.parse(data)

    // 기존 기사 찾기 (URL로 중복 체크)
    const existingIndex = articles.findIndex((a) => a.link === article.link)

    const now = new Date().toISOString()
    const storedArticle: StoredArticle = {
      ...article,
      id: existingIndex >= 0 ? articles[existingIndex].id : generateId(),
      createdAt: existingIndex >= 0 ? articles[existingIndex].createdAt : now,
    }

    if (existingIndex >= 0) {
      // 기존 기사 업데이트
      articles[existingIndex] = storedArticle
    } else {
      // 새 기사 추가
      articles.push(storedArticle)
    }

    // 파일에 저장
    fs.writeFileSync(ARTICLES_FILE, JSON.stringify(articles, null, 2))

    // 통계 업데이트
    updateArticleStats()

    return storedArticle
  } catch (error) {
    console.error("Error saving article:", error)
    throw error
  }
}

// 여러 기사 한 번에 저장하기
export function saveArticles(articles: (CrawledArticle & Partial<BiasAnalysisResult>)[]): StoredArticle[] {
  try {
    initDataStore()

    const data = fs.existsSync(ARTICLES_FILE) ? fs.readFileSync(ARTICLES_FILE, "utf-8") : "[]"

    const existingArticles: StoredArticle[] = JSON.parse(data)
    const storedArticles: StoredArticle[] = []
    const now = new Date().toISOString()

    for (const article of articles) {
      // 기존 기사 찾기 (URL로 중복 체크)
      const existingIndex = existingArticles.findIndex((a) => a.link === article.link)

      const storedArticle: StoredArticle = {
        ...article,
        id: existingIndex >= 0 ? existingArticles[existingIndex].id : generateId(),
        createdAt: existingIndex >= 0 ? existingArticles[existingIndex].createdAt : now,
      }

      if (existingIndex >= 0) {
        // 기존 기사 업데이트
        existingArticles[existingIndex] = storedArticle
      } else {
        // 새 기사 추가
        existingArticles.push(storedArticle)
      }

      storedArticles.push(storedArticle)
    }

    // 파일에 저장
    fs.writeFileSync(ARTICLES_FILE, JSON.stringify(existingArticles, null, 2))

    // 통계 업데이트
    updateArticleStats()

    return storedArticles
  } catch (error) {
    console.error("Error saving articles:", error)
    throw error
  }
}

// 기사 통계 업데이트
function updateArticleStats() {
  try {
    if (!fs.existsSync(ARTICLES_FILE)) {
      return
    }

    const data = fs.readFileSync(ARTICLES_FILE, "utf-8")
    const articles: StoredArticle[] = JSON.parse(data)

    // 최근 7일 이내의 기사만 필터링
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const recentArticles = articles.filter((article) => new Date(article.publishedAt) > oneWeekAgo)

    // 소스 및 성향별 통계 계산
    const statsMap = new Map<string, ArticleStats>()

    for (const article of recentArticles) {
      if (!article.source || !article.bias) continue

      const key = `${article.source}-${article.bias}`

      if (statsMap.has(key)) {
        const stat = statsMap.get(key)!
        stat.count += 1
      } else {
        statsMap.set(key, {
          source: article.source,
          bias: article.bias,
          count: 1,
          lastUpdated: new Date().toISOString(),
        })
      }
    }

    // 통계 저장
    const stats = Array.from(statsMap.values())
    fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2))
  } catch (error) {
    console.error("Error updating article stats:", error)
  }
}

// 기사 통계 가져오기
export function getArticleStats(): ArticleStats[] {
  try {
    if (!fs.existsSync(STATS_FILE)) {
      return []
    }

    const data = fs.readFileSync(STATS_FILE, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error getting article stats:", error)
    return []
  }
}

// 고유 ID 생성 함수
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9)
}

