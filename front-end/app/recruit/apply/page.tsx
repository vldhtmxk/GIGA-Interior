"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Upload, X } from "lucide-react"

export default function ApplyPage() {
  const [formData, setFormData] = useState({
    position: "",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Application submitted:", formData, files)
    alert("지원서가 성공적으로 제출되었습니다. 검토 후 연락드리겠습니다.")
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

  const positions = [
    "시니어 인테리어 디자이너",
    "주니어 인테리어 디자이너",
    "프로젝트 매니저",
    "3D 모델링 전문가",
    "기타",
  ]

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-black mb-6">지원서 작성</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              GIGA Interior와 함께할 준비가 되셨나요? 아래 양식을 작성하여 지원해주세요.
            </p>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Position Selection */}
            <div className="bg-gray-50 p-8 rounded-lg">
              <h2 className="text-2xl font-bold text-black mb-6">지원 포지션</h2>
              <div>
                <label htmlFor="position" className="block text-sm font-medium text-black mb-2">
                  지원하고자 하는 포지션을 선택해주세요 *
                </label>
                <select
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="">포지션을 선택해주세요</option>
                  {positions.map((position) => (
                    <option key={position} value={position}>
                      {position}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-gray-50 p-8 rounded-lg">
              <h2 className="text-2xl font-bold text-black mb-6">개인 정보</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-black mb-2">
                    이름 *
                  </label>
                  <Input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-black mb-2">
                    연락처 *
                  </label>
                  <Input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                    이메일 *
                  </label>
                  <Input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
              </div>
            </div>

            {/* Experience & Education */}
            <div className="bg-gray-50 p-8 rounded-lg">
              <h2 className="text-2xl font-bold text-black mb-6">경력 및 학력</h2>
              <div className="space-y-6">
                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-black mb-2">
                    경력 사항 *
                  </label>
                  <Textarea
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    rows={4}
                    placeholder="주요 경력사항을 시간순으로 작성해주세요. (회사명, 직책, 근무기간, 주요 업무 등)"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="education" className="block text-sm font-medium text-black mb-2">
                    학력 사항 *
                  </label>
                  <Textarea
                    id="education"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    rows={3}
                    placeholder="최종 학력 및 전공을 작성해주세요."
                    required
                  />
                </div>
              </div>
            </div>

            {/* Portfolio & Skills */}
            <div className="bg-gray-50 p-8 rounded-lg">
              <h2 className="text-2xl font-bold text-black mb-6">포트폴리오 및 기술</h2>
              <div className="space-y-6">
                <div>
                  <label htmlFor="portfolio" className="block text-sm font-medium text-black mb-2">
                    포트폴리오 URL 또는 설명
                  </label>
                  <Textarea
                    id="portfolio"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleChange}
                    rows={4}
                    placeholder="온라인 포트폴리오 URL이나 주요 프로젝트에 대한 설명을 작성해주세요."
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">첨부 파일 (이력서, 포트폴리오 등)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 mb-2">파일을 드래그하거나 클릭하여 업로드</p>
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
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                    >
                      파일 선택
                    </label>
                    <p className="text-xs text-gray-400 mt-2">
                      PDF, DOC, DOCX, JPG, PNG 파일만 업로드 가능 (최대 10MB)
                    </p>
                  </div>

                  {/* Uploaded Files */}
                  {files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-3 rounded border">
                          <span className="text-sm text-gray-700">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Motivation & Additional Info */}
            <div className="bg-gray-50 p-8 rounded-lg">
              <h2 className="text-2xl font-bold text-black mb-6">지원 동기 및 기타</h2>
              <div className="space-y-6">
                <div>
                  <label htmlFor="motivation" className="block text-sm font-medium text-black mb-2">
                    지원 동기 *
                  </label>
                  <Textarea
                    id="motivation"
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleChange}
                    rows={5}
                    placeholder="GIGA Interior에 지원하게 된 동기와 포부를 자유롭게 작성해주세요."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="salary" className="block text-sm font-medium text-black mb-2">
                      희망 연봉
                    </label>
                    <Input
                      type="text"
                      id="salary"
                      name="salary"
                      value={formData.salary}
                      onChange={handleChange}
                      placeholder="예: 5000만원 또는 회사 내규에 따름"
                    />
                  </div>

                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-black mb-2">
                      입사 가능일
                    </label>
                    <Input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Agreement */}
            <div className="bg-gray-50 p-8 rounded-lg">
              <h2 className="text-2xl font-bold text-black mb-6">개인정보 처리 동의</h2>
              <div className="space-y-4">
                <div className="text-sm text-gray-600 leading-relaxed">
                  <p className="mb-2">GIGA Interior는 채용 과정에서 수집된 개인정보를 다음과 같이 처리합니다:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>수집 목적: 채용 전형 진행 및 결과 통보</li>
                    <li>수집 항목: 이름, 연락처, 이메일, 경력사항, 학력사항 등</li>
                    <li>보유 기간: 채용 종료 후 1년</li>
                    <li>처리 방법: 암호화된 전자파일로 안전하게 보관</li>
                  </ul>
                </div>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    required
                    className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                  />
                  <span className="text-sm text-gray-700">개인정보 수집 및 이용에 동의합니다 (필수)</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <Button type="submit" size="lg" className="bg-black text-white hover:bg-gray-800 px-12">
                지원서 제출하기
              </Button>
              <p className="text-sm text-gray-500 mt-4">지원서 제출 후 1-2주 내에 검토 결과를 연락드리겠습니다.</p>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
