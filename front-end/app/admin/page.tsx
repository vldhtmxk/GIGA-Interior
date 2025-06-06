import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Briefcase, MessageSquare, UserCheck } from "lucide-react"

export default function AdminDashboard() {
  const stats = [
    {
      title: "총 포트폴리오",
      value: "24",
      icon: Briefcase,
      color: "text-blue-600",
    },
    {
      title: "채용 지원자",
      value: "18",
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "게시글",
      value: "12",
      icon: MessageSquare,
      color: "text-purple-600",
    },
    {
      title: "고객사",
      value: "45",
      icon: UserCheck,
      color: "text-orange-600",
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black">관리자 대시보드</h1>
        <p className="text-gray-600">GIGA Interior 웹사이트 관리</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>최근 지원자</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "김철수", position: "시니어 디자이너", date: "2024-03-15" },
                { name: "이영희", position: "주니어 디자이너", date: "2024-03-14" },
                { name: "박민수", position: "프로젝트 매니저", date: "2024-03-13" },
              ].map((applicant, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{applicant.name}</p>
                    <p className="text-sm text-gray-600">{applicant.position}</p>
                  </div>
                  <span className="text-sm text-gray-500">{applicant.date}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>최근 게시글</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: "2024 인테리어 트렌드", category: "뉴스", date: "2024-03-15" },
                { title: "신규 프로젝트 완료", category: "프로젝트", date: "2024-03-14" },
                { title: "채용 공고 안내", category: "공지", date: "2024-03-13" },
              ].map((post, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{post.title}</p>
                    <p className="text-sm text-gray-600">{post.category}</p>
                  </div>
                  <span className="text-sm text-gray-500">{post.date}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
