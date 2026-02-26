import { env } from "@/lib/env"

type ApiOptions = RequestInit & {
  json?: unknown
}

async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { json, headers, ...rest } = options
  const url = `${env.apiBaseUrl}${path}`
  const isFormData = rest.body instanceof FormData

  const response = await fetch(url, {
    ...rest,
    headers: {
      ...(!isFormData ? { "Content-Type": "application/json" } : {}),
      ...(headers ?? {}),
    },
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  })

  if (!response.ok) {
    let message = `요청에 실패했습니다. (${response.status})`
    try {
      const data = await response.json()
      if (typeof data?.message === "string" && data.message) {
        message = data.message
      } else if (typeof data?.error === "string" && data.error) {
        message = data.error
      }
    } catch {
      // ignore parse failure
    }
    throw new Error(message)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export function resolveAssetUrl(url?: string | null): string {
  if (!url) return ""
  if (/^https?:\/\//i.test(url)) return url
  if (!url.startsWith("/")) return url
  return env.apiBaseUrl ? `${env.apiBaseUrl}${url}` : url
}

export interface CreateInquiryRequest {
  name: string
  email: string
  phone: string
  projectType: string
  budgetRange: string
  message: string
}

export interface InquiryResponse {
  inquiryId: number
  name: string
  email: string | null
  phone: string | null
  projectType: string | null
  budgetRange: string | null
  message: string | null
  status: string | null
  adminMemo: string | null
  repliedAt: string | null
  repliedBy: string | null
  createdAt: string | null
  updatedAt: string | null
}

export interface InquiryMemoHistoryResponse {
  memoHistoryId: number
  adminName: string
  previousMemo: string | null
  nextMemo: string | null
  createdAt: string | null
}

export interface AdminInquiryDetailResponse {
  inquiry: InquiryResponse
  memoHistories: InquiryMemoHistoryResponse[]
  previousInquiryId: number | null
  nextInquiryId: number | null
}

export interface AdminInquiryListResponse {
  items: InquiryResponse[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  statusCounts: Record<string, number>
}

export interface RecruitResponse {
  recruitId: number
  position: string
  department: string | null
  empType: string | null
  careerLevel: string | null
  location: string | null
  deadline: string | null
  description: string | null
  imageUrl: string | null
  isVisible: number | null
  hit: number | null
  createdAt: string | null
  updatedAt: string | null
}

export interface AdminRecruitResponse extends RecruitResponse {
  applicantCount: number
}

export interface AdminRecruitUpsertRequest {
  position: string
  department?: string
  empType?: string
  careerLevel?: string
  location?: string
  deadline?: string
  description?: string
  isVisible?: number
}

export const inquiryApi = {
  create(payload: CreateInquiryRequest) {
    return apiFetch<InquiryResponse>("/api/inquiries", {
      method: "POST",
      json: payload,
    })
  },
}

export const recruitApi = {
  getAll() {
    return apiFetch<RecruitResponse[]>("/api/recruits", {
      method: "GET",
      cache: "no-store",
    })
  },
  getOne(recruitId: number | string) {
    return apiFetch<RecruitResponse>(`/api/recruits/${recruitId}`, {
      method: "GET",
      cache: "no-store",
    })
  },
}

export const adminRecruitApi = {
  getAll(accessToken: string) {
    return apiFetch<AdminRecruitResponse[]>("/api/admin/recruits", {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    })
  },
  create(accessToken: string, payload: AdminRecruitUpsertRequest) {
    return apiFetch<AdminRecruitResponse>("/api/admin/recruits", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      json: payload,
    })
  },
  update(accessToken: string, recruitId: number, payload: AdminRecruitUpsertRequest) {
    return apiFetch<AdminRecruitResponse>(`/api/admin/recruits/${recruitId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${accessToken}` },
      json: payload,
    })
  },
  remove(accessToken: string, recruitId: number) {
    return apiFetch<void>(`/api/admin/recruits/${recruitId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    })
  },
  uploadImage(accessToken: string, recruitId: number, imageFile: File) {
    const formData = new FormData()
    formData.append("image", imageFile)
    return apiFetch<AdminRecruitResponse>(`/api/admin/recruits/${recruitId}/image`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: formData,
    })
  },
}

export interface ApplicantFileResponse {
  applicantFileId: number
  fileName: string
  fileType: string | null
  fileUrl: string
}

export interface ClientPartnerResponse {
  clientId: number
  name: string
  category: string | null
  logoUrl: string | null
  description: string | null
  createdAt: string | null
  updatedAt: string | null
}

export interface CeoInfoResponse {
  ceoInfoId: number
  name: string
  title: string
  message: string
  image: string | null
}

export interface CompanyHistoryResponse {
  historyId: number
  year: number | null
  title: string
  description: string | null
  createdAt: string | null
  updatedAt: string | null
}

export interface AboutContentResponse {
  ceo: CeoInfoResponse | null
  histories: CompanyHistoryResponse[]
}

export interface MainCarouselResponse {
  carouselId: number
  title: string
  subtitle: string | null
  buttonText: string | null
  buttonLink: string | null
  backgroundUrl: string | null
  createdAt: string | null
  updatedAt: string | null
}

export interface HomeFeaturedProjectResponse {
  slotIndex: number | null
  portfolioId: number
  title: string
  category: string | null
  thumbnailUrl: string | null
}

export interface HomeContentResponse {
  carousels: MainCarouselResponse[]
  featuredProjects: HomeFeaturedProjectResponse[]
}

export interface AdminCeoUpsertRequest {
  name: string
  title: string
  message: string
}

export interface CompanyHistoryUpsertRequest {
  year: number
  title: string
  description?: string
}

export interface MainCarouselUpsertRequest {
  title: string
  subtitle?: string
  buttonText?: string
  buttonLink?: string
}

export interface ClientPartnerUpsertRequest {
  name: string
  category: "client" | "partner"
  description?: string
}

export interface PortfolioImageResponse {
  portfolioImageId: number
  imageUrl: string
  altText: string | null
  orderIndex: number
}

export interface PortfolioResponse {
  portfolioId: number
  title: string
  category: string | null
  location: string | null
  year: number | null
  clientName: string | null
  area: string | null
  duration: number | null
  description: string | null
  concept: string | null
  feature: string | null
  materials: string | null
  thumbnailUrl: string | null
  images: PortfolioImageResponse[]
  createdAt: string | null
  updatedAt: string | null
}

export interface PortfolioUpsertRequest {
  title: string
  category?: string
  location?: string
  year?: number
  clientName?: string
  area?: string
  duration?: string
  description?: string
  concept?: string
  feature?: string
  materials?: string
}

export interface ApplicantResponse {
  applicantId: number
  recruitId: number | null
  recruitPosition: string | null
  name: string
  email: string
  phone: string
  status: string | null
  experience: string | null
  education: string | null
  portfolio: string | null
  motivation: string | null
  salary: string | null
  availableDate: string | null
  adminComment: string | null
  createdAt: string | null
  updatedAt: string | null
  files: ApplicantFileResponse[]
}

export interface ApplicantCreateRequest {
  recruitId: number
  name: string
  email: string
  phone: string
  experience: string
  education: string
  portfolio?: string
  motivation: string
  salary?: string
  startDate?: string
  files?: File[]
}

export const applicantApi = {
  create(payload: ApplicantCreateRequest) {
    const formData = new FormData()
    formData.append("name", payload.name)
    formData.append("email", payload.email)
    formData.append("phone", payload.phone)
    formData.append("experience", payload.experience)
    formData.append("education", payload.education)
    if (payload.portfolio) formData.append("portfolio", payload.portfolio)
    formData.append("motivation", payload.motivation)
    if (payload.salary) formData.append("salary", payload.salary)
    if (payload.startDate) formData.append("startDate", payload.startDate)
    for (const file of payload.files ?? []) {
      formData.append("files", file)
    }
    return apiFetch<ApplicantResponse>(`/api/recruits/${payload.recruitId}/applicants`, {
      method: "POST",
      body: formData,
    })
  },
}

export const portfolioApi = {
  getAll() {
    return apiFetch<PortfolioResponse[]>("/api/portfolios", { method: "GET", cache: "no-store" })
  },
  getOne(portfolioId: number | string) {
    return apiFetch<PortfolioResponse>(`/api/portfolios/${portfolioId}`, { method: "GET", cache: "no-store" })
  },
}

export const clientPartnerApi = {
  getAll(params?: { category?: "client" | "partner" }) {
    const search = new URLSearchParams()
    if (params?.category) search.set("category", params.category)
    const qs = search.toString()
    return apiFetch<ClientPartnerResponse[]>(`/api/clients${qs ? `?${qs}` : ""}`, {
      method: "GET",
      cache: "no-store",
    })
  },
}

export const aboutApi = {
  get() {
    return apiFetch<AboutContentResponse>("/api/about", {
      method: "GET",
      cache: "no-store",
    })
  },
}

export const homeContentApi = {
  get() {
    return apiFetch<HomeContentResponse>("/api/home-content", {
      method: "GET",
      cache: "no-store",
    })
  },
}

export const adminPortfolioApi = {
  getAll(accessToken: string) {
    return apiFetch<PortfolioResponse[]>("/api/admin/portfolios", {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    })
  },
  create(accessToken: string, payload: PortfolioUpsertRequest) {
    return apiFetch<PortfolioResponse>("/api/admin/portfolios", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      json: payload,
    })
  },
  update(accessToken: string, portfolioId: number, payload: PortfolioUpsertRequest) {
    return apiFetch<PortfolioResponse>(`/api/admin/portfolios/${portfolioId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${accessToken}` },
      json: payload,
    })
  },
  remove(accessToken: string, portfolioId: number) {
    return apiFetch<void>(`/api/admin/portfolios/${portfolioId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    })
  },
  uploadImages(accessToken: string, portfolioId: number, files: File[]) {
    const formData = new FormData()
    for (const file of files) formData.append("images", file)
    return apiFetch<PortfolioResponse>(`/api/admin/portfolios/${portfolioId}/images`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: formData,
    })
  },
  removeImage(accessToken: string, portfolioId: number, portfolioImageId: number) {
    return apiFetch<PortfolioResponse>(`/api/admin/portfolios/${portfolioId}/images/${portfolioImageId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    })
  },
}

export const adminClientApi = {
  getAll(accessToken: string, params?: { category?: "client" | "partner" }) {
    const search = new URLSearchParams()
    if (params?.category) search.set("category", params.category)
    const qs = search.toString()
    return apiFetch<ClientPartnerResponse[]>(`/api/admin/clients${qs ? `?${qs}` : ""}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    })
  },
  create(accessToken: string, payload: ClientPartnerUpsertRequest) {
    return apiFetch<ClientPartnerResponse>("/api/admin/clients", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      json: payload,
    })
  },
  update(accessToken: string, clientId: number, payload: ClientPartnerUpsertRequest) {
    return apiFetch<ClientPartnerResponse>(`/api/admin/clients/${clientId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${accessToken}` },
      json: payload,
    })
  },
  remove(accessToken: string, clientId: number) {
    return apiFetch<void>(`/api/admin/clients/${clientId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    })
  },
  uploadLogo(accessToken: string, clientId: number, logoFile: File) {
    const formData = new FormData()
    formData.append("logo", logoFile)
    return apiFetch<ClientPartnerResponse>(`/api/admin/clients/${clientId}/logo`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: formData,
    })
  },
}

export const adminAboutApi = {
  get(accessToken: string) {
    return apiFetch<AboutContentResponse>("/api/admin/about", {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    })
  },
  updateCeo(accessToken: string, payload: AdminCeoUpsertRequest) {
    return apiFetch<CeoInfoResponse>("/api/admin/about/ceo", {
      method: "PUT",
      headers: { Authorization: `Bearer ${accessToken}` },
      json: payload,
    })
  },
  uploadCeoImage(accessToken: string, imageFile: File) {
    const formData = new FormData()
    formData.append("image", imageFile)
    return apiFetch<CeoInfoResponse>("/api/admin/about/ceo/image", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: formData,
    })
  },
  createHistory(accessToken: string, payload: CompanyHistoryUpsertRequest) {
    return apiFetch<CompanyHistoryResponse>("/api/admin/about/histories", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      json: payload,
    })
  },
  updateHistory(accessToken: string, historyId: number, payload: CompanyHistoryUpsertRequest) {
    return apiFetch<CompanyHistoryResponse>(`/api/admin/about/histories/${historyId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${accessToken}` },
      json: payload,
    })
  },
  removeHistory(accessToken: string, historyId: number) {
    return apiFetch<void>(`/api/admin/about/histories/${historyId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    })
  },
}

export const adminHomeApi = {
  get(accessToken: string) {
    return apiFetch<HomeContentResponse>("/api/admin/home", {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    })
  },
  createCarousel(accessToken: string, payload: MainCarouselUpsertRequest) {
    return apiFetch<MainCarouselResponse>("/api/admin/home/carousels", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      json: payload,
    })
  },
  updateCarousel(accessToken: string, carouselId: number, payload: MainCarouselUpsertRequest) {
    return apiFetch<MainCarouselResponse>(`/api/admin/home/carousels/${carouselId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${accessToken}` },
      json: payload,
    })
  },
  removeCarousel(accessToken: string, carouselId: number) {
    return apiFetch<void>(`/api/admin/home/carousels/${carouselId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    })
  },
  uploadCarouselImage(accessToken: string, carouselId: number, imageFile: File) {
    const formData = new FormData()
    formData.append("image", imageFile)
    return apiFetch<MainCarouselResponse>(`/api/admin/home/carousels/${carouselId}/image`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: formData,
    })
  },
  updateFeaturedProjects(accessToken: string, portfolioIds: number[]) {
    return apiFetch<HomeFeaturedProjectResponse[]>("/api/admin/home/featured-projects", {
      method: "PUT",
      headers: { Authorization: `Bearer ${accessToken}` },
      json: { portfolioIds },
    })
  },
}

export const adminApplicantApi = {
  getByRecruit(accessToken: string, recruitId: number | string) {
    return apiFetch<ApplicantResponse[]>(`/api/admin/recruits/${recruitId}/applicants`, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    })
  },
  getOne(accessToken: string, applicantId: number | string) {
    return apiFetch<ApplicantResponse>(`/api/admin/applicants/${applicantId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    })
  },
  update(accessToken: string, applicantId: number | string, payload: { status?: string; adminComment?: string }) {
    return apiFetch<ApplicantResponse>(`/api/admin/applicants/${applicantId}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${accessToken}` },
      json: payload,
    })
  },
}

export const adminInquiryApi = {
  getAll(
    accessToken: string,
    params?: { page?: number; size?: number; status?: string; q?: string; sort?: "latest" | "oldest" },
  ) {
    const search = new URLSearchParams()
    if (params?.page) search.set("page", String(params.page))
    if (params?.size) search.set("size", String(params.size))
    if (params?.status && params.status !== "ALL") search.set("status", params.status)
    if (params?.q) search.set("q", params.q)
    if (params?.sort) search.set("sort", params.sort)
    const qs = search.toString()
    return apiFetch<AdminInquiryListResponse>(`/api/admin/inquiries${qs ? `?${qs}` : ""}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  },
  getOne(accessToken: string, inquiryId: number) {
    return apiFetch<AdminInquiryDetailResponse>(`/api/admin/inquiries/${inquiryId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  },
  update(accessToken: string, inquiryId: number, payload: { status?: string; adminMemo?: string }) {
    return apiFetch<InquiryResponse>(`/api/admin/inquiries/${inquiryId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      json: payload,
    })
  },
  replyEmail(
    accessToken: string,
    inquiryId: number,
    payload: { subject: string; body: string; markDone?: boolean },
  ) {
    return apiFetch<InquiryResponse>(`/api/admin/inquiries/${inquiryId}/reply-email`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      json: payload,
    })
  },
  async downloadCsv(accessToken: string) {
    const response = await fetch(`${env.apiBaseUrl}/api/admin/inquiries/export.csv`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    if (!response.ok) {
      throw new Error(`CSV 다운로드에 실패했습니다. (${response.status})`)
    }
    return response.blob()
  },
}

export interface AdminLoginRequest {
  username: string
  password: string
}

export interface AdminAuthProfile {
  adminId: number
  username: string
  name: string
  role: string
}

export interface AdminLoginResponse {
  accessToken: string
  admin: AdminAuthProfile
}

export const adminAuthApi = {
  login(payload: AdminLoginRequest) {
    return apiFetch<AdminLoginResponse>("/api/admin/auth/login", {
      method: "POST",
      json: payload,
    })
  },
  me(accessToken: string) {
    return apiFetch<AdminAuthProfile>("/api/admin/auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  },
  logout(accessToken?: string) {
    return apiFetch<void>("/api/admin/auth/logout", {
      method: "POST",
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : undefined,
    })
  },
}
