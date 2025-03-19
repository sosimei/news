import { Pool } from 'pg';
import { CrawledArticle } from './crawler';
import { BiasAnalysisResult } from './bias-analyzer';

// 데이터베이스 연결 설정
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// 테이블 생성 함수
export async function initDatabase() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS articles (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        link TEXT UNIQUE NOT NULL,
        source TEXT NOT NULL,
        category TEXT,
        published_at TIMESTAMP NOT NULL,
        content TEXT,
        bias TEXT,
        bias_score NUMERIC(3,1),
        bias_analysis TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_articles_source ON articles(source);
      CREATE INDEX IF NOT EXISTS idx_articles_bias ON articles(bias);
      CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at);
    `);
    console.log('Database initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    client.release();
  }
}

// 기사 저장 함수
export async function saveArticle(article: CrawledArticle & Partial<BiasAnalysisResult>) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO articles 
       (title, description, link, source, category, published_at, content, bias, bias_score, bias_analysis)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (link) DO UPDATE
       SET title = $1, description = $2, source = $4, category = $5, 
           content = $7, bias = $8, bias_score = $9, bias_analysis = $10
       RETURNING id`,
      [
        article.title,
        article.description,
        article.link,
        article.source,
        article.category,
        article.publishedAt,
        article.content,
        article.bias,
        article.biasScore,
        article.biasAnalysis
      ]
    );
    return result.rows[0].id;
  } catch (error) {
    console.error('Error saving article:', error);
    throw error;
  } finally {
    client.release();
  }
}

// 기사 조회 함수
export async function getArticles(limit = 20, offset = 0, filters: { source?: string, bias?: string, category?: string } = {}) {
  const client = await pool.connect();
  try {
    let query = `
      SELECT * FROM articles
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramIndex = 1;
    
    if (filters.source) {
      query += ` AND source = $${paramIndex++}`;
      params.push(filters.source);
    }
    
    if (filters.bias) {
      query += ` AND bias = $${paramIndex++}`;
      params.push(filters.bias);
    }
    
    if (filters.category) {
      query += ` AND category = $${paramIndex++}`;
      params.push(filters.category);
    }
    
    query += ` ORDER BY published_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(limit, offset);
    
    const result = await client.query(query, params);
    return result.rows;
  } catch (error) {
    console.error('Error getting articles:', error);
    return [];
  } finally {
    client.release();
  }
}

// 특정 기사 조회 함수
export async function getArticleById(id: number) {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM articles WHERE id = $1', [id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting article by ID:', error);
    return null;
  } finally {
    client.release();
  }
}

// 기사 통계 조회 함수
export async function getArticleStats() {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT 
        source, 
        bias, 
        COUNT(*) as count
      FROM articles
      WHERE created_at > NOW() - INTERVAL '7 days'
      GROUP BY source, bias
      ORDER BY source, bias
    `);
    return result.rows;
  } catch (error) {
    console.error('Error getting article stats:', error);
    return [];
  } finally {
    client.release();
  }
}
