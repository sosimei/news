# 뉴스 비교 플랫폼 (News Compare)

한국 뉴스 기사를 크롤링하고 AI를 사용하여 정치적 성향을 분석하는 플랫폼입니다.

## 기능

- 주요 한국 뉴스 사이트에서 기사 자동 크롤링
- Ollama(로컬), OpenAI 또는 Claude를 사용한 기사 정치적 성향 분석
- 다양한 관점에서의 뉴스 비교 제공
- 정치적 스펙트럼에 따른 뉴스 소스 시각화
- JSON 파일 기반 데이터 저장 (데이터베이스 불필요)

## 설정 방법

### 환경 변수

`.env.local` 파일에 다음 환경 변수를 설정하세요:
\`\`\`
DATABASE_URL=postgresql://username:password@localhost:5432/newscompare
CRON_API_KEY=your_secure_random_string
\`\`\`

### Ollama 설정 (로컬 AI 모델 사용시)

1. [Ollama](https://ollama.ai/)를 설치하세요.
2. 다음 명령어로 Llama3.3 모델을 다운로드하세요:
   \`\`\`
   ollama pull llama3.3:70b-instruct-q3_K_S
   \`\`\`
3. Ollama 서버를 실행하세요:
   \`\`\`
   ollama serve
   \`\`\`
4. 서버는 기본적으로 http://localhost:11434에서 실행됩니다.

### OpenAI 사용 (선택사항)

OpenAI API를 사용하려면 `.env.local` 파일에 다음 환경 변수를 추가하세요:
\`\`\`
OPENAI_API_KEY=your_openai_api_key
\`\`\`

### 데이터베이스 설정

PostgreSQL 데이터베이스를 설정하고 연결 문자열을 환경 변수에 추가하세요.

### 정기적인 크롤링 설정

뉴스 기사를 정기적으로 크롤링하기 위해 다음 방법 중 하나를 사용할 수 있습니다:

#### 1. Vercel Cron Jobs (권장)

Vercel에 배포하는 경우, `vercel.json` 파일에 다음을 추가하세요:

\`\`\`json
{
  "crons": [
    {
      "path": "/api/cron?key=your_cron_api_key",
      "schedule": "0 * * * *"  // 매시간마다 실행
    }
  ]
}
\`\`\`

#### 2. 외부 Cron 서비스 사용

[Cron-job.org](https://cron-job.org) 또는 [GitHub Actions](https://github.com/features/actions)와 같은 외부 서비스를 사용하여 정기적으로 `/api/cron?key=your_cron_api_key` 엔드포인트를 호출할 수 있습니다.

#### 3. 서버리스 함수 사용

AWS Lambda 또는 Google Cloud Functions와 같은 서버리스 함수를 사용하여 정기적으로 크롤링 작업을 실행할 수 있습니다.

## 개발

\`\`\`bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프로덕션 서버 실행
npm start
\`\`\`

## 기술 스택

- Next.js (App Router)
- TypeScript
- PostgreSQL
- Ollama (로컬 AI 모델)
- OpenAI API (선택사항)
- Cheerio (웹 크롤링)
- Tailwind CSS
- shadcn/ui

