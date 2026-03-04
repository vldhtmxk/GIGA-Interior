import RecruitSections from "@/components/recruit-sections"
import { recruitApi, resolveAssetUrl, type RecruitResponse } from "@/lib/api"

const formatDate = (value?: string | null) => {
  if (!value) return "상시채용"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString("ko-KR")
}

const toCard = (item: RecruitResponse) => ({
  id: item.recruitId,
  title: item.position,
  department: item.department ?? "미정",
  type: item.empType ?? "미정",
  experience: item.careerLevel ?? "협의",
  location: item.location ?? "미정",
  deadline: formatDate(item.deadline),
  description: item.description ?? "채용 상세 내용은 공고 상세 페이지에서 확인해주세요.",
  imageUrl: resolveAssetUrl(item.imageUrl),
})

export default async function RecruitPage() {
  let positions: ReturnType<typeof toCard>[] = []
  try {
    positions = (await recruitApi.getAll()).map(toCard)
  } catch {
    positions = []
  }

  return <RecruitSections positions={positions} />
}

