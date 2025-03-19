import type { ArticleStats } from "@/lib/json-store"

interface PoliticalSpectrumProps {
  stats: ArticleStats[]
}

export function PoliticalSpectrum({ stats }: PoliticalSpectrumProps) {
  return (
    <div className="space-y-6">
      <div className="relative h-12">
        <div className="absolute inset-0 flex">
          <div className="h-full w-1/5 bg-blue-500"></div>
          <div className="h-full w-1/5 bg-sky-400"></div>
          <div className="h-full w-1/5 bg-gray-400"></div>
          <div className="h-full w-1/5 bg-amber-400"></div>
          <div className="h-full w-1/5 bg-red-500"></div>
        </div>
        <div className="absolute inset-0 flex justify-between px-4 text-xs font-medium text-white">
          <div className="pt-1">좌파</div>
          <div className="pt-1">중도좌파</div>
          <div className="pt-1">중도</div>
          <div className="pt-1">중도우파</div>
          <div className="pt-1">우파</div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {/* 통계 데이터가 있으면 표시, 없으면 기본 데이터 표시 */}
        {stats.length > 0 ? (
          <>
            {renderBiasCard(stats, "left-leaning")}
            {renderBiasCard(stats, "center-left")}
            {renderBiasCard(stats, "center")}
            {renderBiasCard(stats, "center-right")}
            {renderBiasCard(stats, "right-leaning")}
          </>
        ) : (
          <>
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
              <h4 className="font-bold text-blue-800">한겨레</h4>
              <p className="mt-1 text-xs text-blue-700">"최저임금 인상은 경제 정의 실현을 위한 필수 정책"</p>
            </div>
            <div className="rounded-lg border border-sky-200 bg-sky-50 p-3">
              <h4 className="font-bold text-sky-800">경향신문</h4>
              <p className="mt-1 text-xs text-sky-700">"정부의 환경 정책, 더 강력한 규제 필요해"</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
              <h4 className="font-bold text-gray-800">중앙일보</h4>
              <p className="mt-1 text-xs text-gray-700">"남북 관계, 실용적 접근이 필요한 시점"</p>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
              <h4 className="font-bold text-amber-800">동아일보</h4>
              <p className="mt-1 text-xs text-amber-700">"기업 규제 완화로 경제 활력 되찾아야"</p>
            </div>
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <h4 className="font-bold text-red-800">조선일보</h4>
              <p className="mt-1 text-xs text-red-700">"안보 위협 대응, 강력한 국방력 확보 시급"</p>
            </div>
          </>
        )}
      </div>

      <div className="rounded-lg border p-4">
        <h3 className="mb-2 text-lg font-bold">정치 이슈별 언론사 입장 비교</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">이슈</th>
                <th className="p-2 text-left">좌파 언론</th>
                <th className="p-2 text-left">중도 언론</th>
                <th className="p-2 text-left">우파 언론</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-medium">대북 정책</td>
                <td className="p-2 text-sm">대화와 교류 중심</td>
                <td className="p-2 text-sm">상호주의적 접근</td>
                <td className="p-2 text-sm">강경 대응 필요</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-medium">경제 정책</td>
                <td className="p-2 text-sm">복지 확대, 분배 강조</td>
                <td className="p-2 text-sm">성장과 분배 균형</td>
                <td className="p-2 text-sm">규제 완화, 성장 중심</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-medium">환경 정책</td>
                <td className="p-2 text-sm">강력한 환경 규제</td>
                <td className="p-2 text-sm">단계적 전환</td>
                <td className="p-2 text-sm">경제 영향 고려 필요</td>
              </tr>
              <tr>
                <td className="p-2 font-medium">교육 정책</td>
                <td className="p-2 text-sm">평등 교육 강조</td>
                <td className="p-2 text-sm">공정성과 다양성</td>
                <td className="p-2 text-sm">경쟁과 수월성 강조</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// 특정 성향의 카드 렌더링
function renderBiasCard(stats: ArticleStats[], bias: string) {
  const biasStats = stats.filter((stat) => stat.bias === bias)

  if (biasStats.length === 0) {
    return (
      <div className={`rounded-lg border p-3 ${getBiasBorderColor(bias)}`}>
        <h4 className={`font-bold ${getBiasTextColor(bias)}`}>데이터 없음</h4>
        <p className={`mt-1 text-xs ${getBiasLightTextColor(bias)}`}>"아직 수집된 기사가 없습니다"</p>
      </div>
    )
  }

  // 가장 많은 기사를 가진 소스 찾기
  const topSource = biasStats.reduce((prev, current) => (prev.count > current.count ? prev : current))

  return (
    <div className={`rounded-lg border p-3 ${getBiasBorderColor(bias)}`}>
      <h4 className={`font-bold ${getBiasTextColor(bias)}`}>{topSource.source}</h4>
      <p className={`mt-1 text-xs ${getBiasLightTextColor(bias)}`}>{`${topSource.count}개의 기사 (${bias})`}</p>
    </div>
  )
}

// 정치적 성향에 따른 테두리 색상 반환
function getBiasBorderColor(bias: string): string {
  switch (bias) {
    case "left-leaning":
      return "border-blue-200 bg-blue-50"
    case "center-left":
      return "border-sky-200 bg-sky-50"
    case "center":
      return "border-gray-200 bg-gray-50"
    case "center-right":
      return "border-amber-200 bg-amber-50"
    case "right-leaning":
      return "border-red-200 bg-red-50"
    default:
      return "border-gray-200 bg-gray-50"
  }
}

// 정치적 성향에 따른 텍스트 색상 반환
function getBiasTextColor(bias: string): string {
  switch (bias) {
    case "left-leaning":
      return "text-blue-800"
    case "center-left":
      return "text-sky-800"
    case "center":
      return "text-gray-800"
    case "center-right":
      return "text-amber-800"
    case "right-leaning":
      return "text-red-800"
    default:
      return "text-gray-800"
  }
}

// 정치적 성향에 따른 연한 텍스트 색상 반환
function getBiasLightTextColor(bias: string): string {
  switch (bias) {
    case "left-leaning":
      return "text-blue-700"
    case "center-left":
      return "text-sky-700"
    case "center":
      return "text-gray-700"
    case "center-right":
      return "text-amber-700"
    case "right-leaning":
      return "text-red-700"
    default:
      return "text-gray-700"
  }
}

