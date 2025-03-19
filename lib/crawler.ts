import * as cheerio from 'cheerio';

// 크롤링할 뉴스 사이트 목록
const NEWS_SOURCES = [
  { 
    name: '조선일보', 
    url: 'https://www.chosun.com', 
    articleSelector: '.list_item',
    titleSelector: '.title a',
    linkSelector: '.title a',
    descriptionSelector: '.txt_lede',
    categorySelector: '.txt_categ'
  },
  { 
    name: '한겨레', 
    url: 'https://www.hani.co.kr', 
    articleSelector: '.article-area',
    titleSelector: '.article-title a',
    linkSelector: '.article-title a',
    descriptionSelector: '.article-prologue',
    categorySelector: '.article-category'
  },
  // 다른 뉴스 사이트도 추가 가능
];

export interface CrawledArticle {
  title: string;
  description: string;
  link: string;
  source: string;
  category: string;
  publishedAt: Date;
  content?: string;
  bias?: string;
  biasScore?: number;
  biasAnalysis?: string;
}

/**
 * 특정 뉴스 사이트에서 최신 기사를 크롤링합니다.
 */
export async function crawlNewsSource(source: typeof NEWS_SOURCES[0]): Promise<CrawledArticle[]> {
  try {
    const response = await fetch(source.url);
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const articles: CrawledArticle[] = [];
    
    $(source.articleSelector).each((i, el) => {
      if (i >= 10) return; // 최대 10개 기사만 수집
      
      const title = $(el).find(source.titleSelector).text().trim();
      const link = $(el).find(source.linkSelector).attr('href') || '';
      const description = $(el).find(source.descriptionSelector).text().trim();
      const category = $(el).find(source.categorySelector).text().trim();
      
      // 상대 URL을 절대 URL로 변환
      const fullLink = link.startsWith('http') ? link : `${new URL(source.url).origin}${link}`;
      
      if (title && link) {
        articles.push({
          title,
          description,
          link: fullLink,
          source: source.name,
          category,
          publishedAt: new Date(),
        });
      }
    });
    
    return articles;
  } catch (error) {
    console.error(`Error crawling ${source.name}:`, error);
    return [];
  }
}

/**
 * 모든 뉴스 사이트에서 기사를 크롤링합니다.
 */
export async function crawlAllNewsSources(): Promise<CrawledArticle[]> {
  const allArticlesPromises = NEWS_SOURCES.map(source => crawlNewsSource(source));
  const allArticlesArrays = await Promise.all(allArticlesPromises);
  
  // 모든 기사를 하나의 배열로 합칩니다
  return allArticlesArrays.flat();
}

/**
 * 특정 기사의 전체 내용을 크롤링합니다.
 */
export async function crawlArticleContent(article: CrawledArticle): Promise<string> {
  try {
    const response = await fetch(article.link);
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // 각 뉴스 사이트마다 본문 선택자가 다를 수 있습니다
    let contentSelector = '.article_body';
    if (article.source === '한겨레') {
      contentSelector = '.article-text';
    } else if (article.source === '조선일보') {
      contentSelector = '.article-body';
    }
    
    const content = $(contentSelector).text().trim();
    return content;
  } catch (error) {
    console.error(`Error crawling content for ${article.title}:`, error);
    return '';
  }
}
