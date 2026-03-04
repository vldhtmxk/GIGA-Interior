"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import { Upload, X } from "lucide-react"
import { applicantApi, recruitApi, type RecruitResponse } from "@/lib/api"

export default function ApplyPage() {
  const [formData, setFormData] = useState({
    recruitId: "",
    name: "",
    email: "",
    phone: "",
    experience: "",
    education: "",
    portfolio: "",
    motivation: "",
    salary: "",
    startDate: "",
  })

  const [files, setFiles] = useState<File[]>([])
  const [positions, setPositions] = useState<RecruitResponse[]>([])
  const [isLoadingPositions, setIsLoadingPositions] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    let cancelled = false
    setIsLoadingPositions(true)
    recruitApi
      .getAll()
      .then((items) => {
        if (cancelled) return
        setPositions(items)
      })
      .catch((e) => {
        if (cancelled) return
        setError(e instanceof Error ? e.message : "채용 공고 목록을 불러오지 못했습니다.")
      })
      .finally(() => {
        if (!cancelled) setIsLoadingPositions(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const recruitIdFromQuery = new URLSearchParams(window.location.search).get("recruitId")
    if (recruitIdFromQuery) {
      setFormData((prev) => ({ ...prev, recruitId: recruitIdFromQuery }))
    }
  }, [])

  const selectedRecruit = useMemo(
    () => positions.find((item) => String(item.recruitId) === formData.recruitId) ?? null,
    [positions, formData.recruitId],
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.recruitId) {
      setError("지원할 채용공고를 선택해주세요.")
      return
    }
    setIsSubmitting(true)
    setError("")
    setSuccessMessage("")
    try {
      await applicantApi.create({
        recruitId: Number(formData.recruitId),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        experience: formData.experience,
        education: formData.education,
        portfolio: formData.portfolio,
        motivation: formData.motivation,
        salary: formData.salary,
        startDate: formData.startDate,
        files,
      })
      setSuccessMessage("지원서가 성공적으로 제출되었습니다. 검토 후 연락드리겠습니다.")
      setFormData({
        recruitId: formData.recruitId,
        name: "",
        email: "",
        phone: "",
        experience: "",
        education: "",
        portfolio: "",
        motivation: "",
        salary: "",
        startDate: "",
      })
      setFiles([])
    } catch (e) {
      setError(e instanceof Error ? e.message : "지원서 제출에 실패했습니다.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles([...files, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  return (
    <main className="giga-public-surface min-h-screen pt-24">
      <section className="mx-auto max-w-[1200px] px-6 py-16 lg:px-16 lg:py-20">
        <p className="mb-4 text-[10px] uppercase tracking-[0.35em] text-[#c9a96e] giga-fade-up">Careers</p>
        <h1 className="giga-display giga-fade-up text-[clamp(2.2rem,6vw,5.2rem)] font-light leading-none text-white">
          지원서 작성
        </h1>
        <p className="giga-fade-up mt-5 max-w-2xl text-sm leading-relaxed text-white/45 lg:text-base">
          GIGA Interior와 함께할 준비가 되셨나요? 아래 정보를 입력해 지원서를 제출해 주세요.
        </p>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 pb-24 lg:px-16">
        {error && <div className="mb-5 border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-300">{error}</div>}
        {successMessage && (
          <div className="mb-5 border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">{successMessage}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <section className="giga-card-reveal border border-white/10 p-6 lg:p-8">
            <p className="mb-5 text-[10px] uppercase tracking-[0.25em] text-[#c9a96e]">지원 포지션</p>
            <label htmlFor="position" className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/35">
              포지션 선택 *
            </label>
            <select
              id="position"
              name="recruitId"
              value={formData.recruitId}
              onChange={handleChange}
              required
              className="w-full cursor-pointer border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#c9a96e]/50"
            >
              <option value="">{isLoadingPositions ? "불러오는 중..." : "포지션을 선택해주세요"}</option>
              {positions.map((position) => (
                <option key={position.recruitId} value={position.recruitId}>
                  {position.position}
                </option>
              ))}
            </select>
            {selectedRecruit && (
              <p className="mt-3 text-xs text-white/40">
                {selectedRecruit.department ?? "미정"} / {selectedRecruit.empType ?? "미정"} / {selectedRecruit.location ?? "미정"}
              </p>
            )}
          </section>

          <section className="giga-card-reveal border border-white/10 p-6 lg:p-8">
            <p className="mb-5 text-[10px] uppercase tracking-[0.25em] text-[#c9a96e]">개인 정보</p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/35">
                  이름 *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-white/10 bg-transparent px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#c9a96e]/50"
                />
              </div>
              <div>
                <label htmlFor="phone" className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/35">
                  연락처 *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full border border-white/10 bg-transparent px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#c9a96e]/50"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="email" className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/35">
                  이메일 *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-white/10 bg-transparent px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#c9a96e]/50"
                />
              </div>
            </div>
          </section>

          <section className="giga-card-reveal border border-white/10 p-6 lg:p-8">
            <p className="mb-5 text-[10px] uppercase tracking-[0.25em] text-[#c9a96e]">경력 및 학력</p>
            <div className="space-y-4">
              <div>
                <label htmlFor="experience" className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/35">
                  경력 사항 *
                </label>
                <textarea
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  rows={4}
                  placeholder="주요 경력사항을 작성해주세요."
                  required
                  className="w-full resize-none border border-white/10 bg-transparent px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-[#c9a96e]/50"
                />
              </div>
              <div>
                <label htmlFor="education" className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/35">
                  학력 사항 *
                </label>
                <textarea
                  id="education"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  rows={3}
                  placeholder="최종 학력 및 전공을 작성해주세요."
                  required
                  className="w-full resize-none border border-white/10 bg-transparent px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-[#c9a96e]/50"
                />
              </div>
            </div>
          </section>

          <section className="giga-card-reveal border border-white/10 p-6 lg:p-8">
            <p className="mb-5 text-[10px] uppercase tracking-[0.25em] text-[#c9a96e]">포트폴리오 및 첨부</p>
            <div className="space-y-4">
              <div>
                <label htmlFor="portfolio" className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/35">
                  포트폴리오 URL 또는 설명
                </label>
                <textarea
                  id="portfolio"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleChange}
                  rows={4}
                  placeholder="온라인 포트폴리오 URL 또는 프로젝트 설명"
                  className="w-full resize-none border border-white/10 bg-transparent px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-[#c9a96e]/50"
                />
              </div>

              <div className="border border-dashed border-white/20 p-6 text-center">
                <Upload className="mx-auto mb-3 h-7 w-7 text-white/35" />
                <p className="mb-3 text-sm text-white/45">파일을 선택해 업로드하세요</p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex cursor-pointer items-center border border-[#c9a96e]/60 px-5 py-2 text-[10px] uppercase tracking-[0.2em] text-[#c9a96e] transition-colors hover:bg-[#c9a96e] hover:text-[#0a0a0a]"
                >
                  파일 선택
                </label>
                <p className="mt-3 text-xs text-white/30">PDF, DOC, DOCX, JPG, PNG (최대 10MB)</p>
              </div>

              {files.length > 0 && (
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between border border-white/10 px-3 py-2">
                      <span className="text-xs text-white/65">{file.name}</span>
                      <button type="button" onClick={() => removeFile(index)} className="text-white/40 transition-colors hover:text-red-300">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="giga-card-reveal border border-white/10 p-6 lg:p-8">
            <p className="mb-5 text-[10px] uppercase tracking-[0.25em] text-[#c9a96e]">지원 동기 및 추가 정보</p>
            <div className="space-y-4">
              <div>
                <label htmlFor="motivation" className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/35">
                  지원 동기 *
                </label>
                <textarea
                  id="motivation"
                  name="motivation"
                  value={formData.motivation}
                  onChange={handleChange}
                  rows={5}
                  required
                  placeholder="지원 동기와 포부를 작성해주세요."
                  className="w-full resize-none border border-white/10 bg-transparent px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-[#c9a96e]/50"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="salary" className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/35">
                    희망 연봉
                  </label>
                  <input
                    type="text"
                    id="salary"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    placeholder="예: 5,000만원"
                    className="w-full border border-white/10 bg-transparent px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-[#c9a96e]/50"
                  />
                </div>
                <div>
                  <label htmlFor="startDate" className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/35">
                    입사 가능일
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#c9a96e]/50"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="giga-card-reveal border border-white/10 p-6 lg:p-8">
            <p className="mb-5 text-[10px] uppercase tracking-[0.25em] text-[#c9a96e]">개인정보 처리 동의</p>
            <div className="space-y-4 text-sm text-white/45">
              <ul className="space-y-1">
                <li>수집 목적: 채용 전형 진행 및 결과 통보</li>
                <li>수집 항목: 이름, 연락처, 이메일, 경력사항, 학력사항 등</li>
                <li>보유 기간: 채용 종료 후 1년</li>
              </ul>
              <label className="flex items-center gap-3 text-white/65">
                <input type="checkbox" required className="h-4 w-4 border-white/30 bg-[#0a0a0a]" />
                <span>개인정보 수집 및 이용에 동의합니다 (필수)</span>
              </label>
            </div>
          </section>

          <div className="pt-4 text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center bg-[#c9a96e] px-12 py-4 text-[11px] uppercase tracking-[0.24em] text-[#0a0a0a] transition-colors hover:bg-white disabled:opacity-70"
            >
              {isSubmitting ? "제출 중..." : "지원서 제출하기"}
            </button>
            <p className="mt-4 text-xs text-white/30">지원서 제출 후 1-2주 내에 검토 결과를 연락드리겠습니다.</p>
          </div>
        </form>
      </section>
    </main>
  )
}
