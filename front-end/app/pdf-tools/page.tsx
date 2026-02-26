"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { FileText, GripVertical, Merge, Scissors, Upload, X } from "lucide-react"

type ToolMode = "merge" | "split"
type SplitMode = "range" | "single" | "chunk"

type SelectedFile = {
  id: string
  name: string
  size: number
  file: File
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  const units = ["KB", "MB", "GB"]
  let size = bytes / 1024
  let unit = 0
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024
    unit += 1
  }
  return `${size.toFixed(size >= 10 ? 0 : 1)} ${units[unit]}`
}

function parseRanges(input: string) {
  const cleaned = input.replace(/\s+/g, "")
  if (!cleaned) return { valid: false, message: "페이지 범위를 입력하세요." }

  const chunks = cleaned.split(",")
  for (const chunk of chunks) {
    if (!chunk) return { valid: false, message: "쉼표(,) 사이 값이 비어 있습니다." }
    if (/^\d+$/.test(chunk)) continue
    if (/^\d+-\d+$/.test(chunk)) {
      const [start, end] = chunk.split("-").map(Number)
      if (start > end) {
        return { valid: false, message: `${chunk}: 시작 페이지가 끝 페이지보다 큽니다.` }
      }
      continue
    }
    return { valid: false, message: `${chunk}: 올바른 형식이 아닙니다. (예: 1-3,5,8)` }
  }
  return { valid: true, message: "유효한 범위 형식입니다." }
}

export default function PdfToolsPage() {
  const [toolMode, setToolMode] = useState<ToolMode>("merge")
  const [splitMode, setSplitMode] = useState<SplitMode>("range")
  const [files, setFiles] = useState<SelectedFile[]>([])
  const [rangeText, setRangeText] = useState("1-3,5")
  const [chunkSize, setChunkSize] = useState("2")
  const [dragActive, setDragActive] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const rangeValidation = useMemo(() => parseRanges(rangeText), [rangeText])
  const splitTarget = files[0] ?? null
  const canRunMerge = files.length >= 2
  const canRunSplit =
    !!splitTarget &&
    (splitMode === "single" ||
      (splitMode === "range" && rangeValidation.valid) ||
      (splitMode === "chunk" && Number(chunkSize) > 0))

  useEffect(() => {
    if (!isRunning) return
    setProgress(0)
    const timer = window.setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 18 + 8)
        if (next >= 100) {
          window.clearInterval(timer)
          setIsRunning(false)
          return 100
        }
        return next
      })
    }, 350)
    return () => window.clearInterval(timer)
  }, [isRunning])

  function addFiles(fileList: FileList | null) {
    if (!fileList?.length) return
    const pdfs = Array.from(fileList).filter((file) => file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"))
    const mapped = pdfs.map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
      name: file.name,
      size: file.size,
      file,
    }))

    setFiles((prev) => {
      if (toolMode === "split") return mapped.slice(0, 1)
      return [...prev, ...mapped]
    })
  }

  function removeFile(id: string) {
    setFiles((prev) => prev.filter((file) => file.id !== id))
  }

  function moveFile(index: number, direction: -1 | 1) {
    setFiles((prev) => {
      const next = [...prev]
      const target = index + direction
      if (target < 0 || target >= next.length) return prev
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  function onDropFiles(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setDragActive(false)
    addFiles(event.dataTransfer.files)
  }

  function runDemo() {
    setProgress(0)
    setIsRunning(true)
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#e8f1ff,_#f9fafb_45%,_#ffffff_70%)] text-slate-900">
      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.35)] backdrop-blur md:p-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                PDF 유틸리티 프로토타입
              </p>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">PDF 분리 · 병합 도구</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
                HTML 구조를 기반으로, Tailwind CSS(최신 유틸리티 CSS)와 JavaScript 상호작용으로 사용자 친화적인 UI/UX를 먼저 구현한 화면입니다.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
              <p className="font-semibold">기본 설정</p>
              <p className="mt-1 text-slate-600">문서 인코딩: UTF-8 (앱 head 메타 명시)</p>
              <p className="text-slate-600">처리 방식: 로컬 우선 (현재는 UI 프로토타입)</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.25fr_0.9fr]">
            <section aria-labelledby="workbench-title" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 id="workbench-title" className="text-lg font-semibold">
                  작업 공간
                </h2>
                <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setToolMode("merge")
                      setProgress(0)
                      setIsRunning(false)
                    }}
                    className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                      toolMode === "merge" ? "bg-white text-slate-900 shadow" : "text-slate-500 hover:text-slate-800"
                    }`}
                    aria-pressed={toolMode === "merge"}
                  >
                    <Merge className="h-4 w-4" />
                    병합
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setToolMode("split")
                      setFiles((prev) => prev.slice(0, 1))
                      setProgress(0)
                      setIsRunning(false)
                    }}
                    className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                      toolMode === "split" ? "bg-white text-slate-900 shadow" : "text-slate-500 hover:text-slate-800"
                    }`}
                    aria-pressed={toolMode === "split"}
                  >
                    <Scissors className="h-4 w-4" />
                    분리
                  </button>
                </div>
              </div>

              <input
                ref={inputRef}
                type="file"
                accept=".pdf,application/pdf"
                multiple={toolMode === "merge"}
                className="hidden"
                onChange={(event) => addFiles(event.target.files)}
              />

              <div
                onDragOver={(event) => {
                  event.preventDefault()
                  setDragActive(true)
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={onDropFiles}
                className={`rounded-2xl border-2 border-dashed p-6 text-center transition ${
                  dragActive ? "border-sky-500 bg-sky-50" : "border-slate-300 bg-slate-50/80"
                }`}
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white">
                  <Upload className="h-5 w-5" />
                </div>
                <p className="font-semibold">
                  {toolMode === "merge" ? "여러 PDF를 드래그해서 추가" : "PDF 1개를 드래그해서 추가"}
                </p>
                <p className="mt-1 text-sm text-slate-600">또는 버튼으로 파일 선택 (PDF만 허용)</p>
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                >
                  PDF 선택
                </button>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-slate-900">선택된 파일</h3>
                  <p className="text-xs text-slate-500">
                    {toolMode === "merge" ? "2개 이상 선택 시 병합 가능" : "분리 모드는 1개만 사용"}
                  </p>
                </div>

                {files.length === 0 ? (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                    아직 선택된 PDF가 없습니다.
                  </div>
                ) : (
                  <ul className="space-y-2" aria-label="선택된 PDF 파일 목록">
                    {files.map((file, index) => (
                      <li
                        key={file.id}
                        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50 text-rose-700">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-slate-500">{formatBytes(file.size)}</p>
                        </div>
                        {toolMode === "merge" && (
                          <div className="flex items-center gap-1">
                            <GripVertical className="h-4 w-4 text-slate-400" />
                            <button
                              type="button"
                              className="rounded-md border px-2 py-1 text-xs hover:bg-slate-50"
                              onClick={() => moveFile(index, -1)}
                              aria-label={`${file.name} 위로 이동`}
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              className="rounded-md border px-2 py-1 text-xs hover:bg-slate-50"
                              onClick={() => moveFile(index, 1)}
                              aria-label={`${file.name} 아래로 이동`}
                            >
                              ↓
                            </button>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeFile(file.id)}
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                          aria-label={`${file.name} 제거`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {toolMode === "split" && (
                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <h3 className="mb-3 font-medium">분리 옵션</h3>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <button
                      type="button"
                      onClick={() => setSplitMode("range")}
                      className={`rounded-xl border p-3 text-left text-sm transition ${
                        splitMode === "range" ? "border-sky-400 bg-white shadow-sm" : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <p className="font-semibold">페이지 범위</p>
                      <p className="mt-1 text-xs text-slate-500">예: 1-3,5,8-10</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSplitMode("single")}
                      className={`rounded-xl border p-3 text-left text-sm transition ${
                        splitMode === "single" ? "border-sky-400 bg-white shadow-sm" : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <p className="font-semibold">개별 페이지</p>
                      <p className="mt-1 text-xs text-slate-500">각 페이지를 파일로 분리</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSplitMode("chunk")}
                      className={`rounded-xl border p-3 text-left text-sm transition ${
                        splitMode === "chunk" ? "border-sky-400 bg-white shadow-sm" : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <p className="font-semibold">N페이지 단위</p>
                      <p className="mt-1 text-xs text-slate-500">예: 2페이지씩 분할</p>
                    </button>
                  </div>

                  {splitMode === "range" && (
                    <div className="mt-4">
                      <label htmlFor="range-input" className="mb-2 block text-sm font-medium">
                        페이지 범위 입력
                      </label>
                      <input
                        id="range-input"
                        value={rangeText}
                        onChange={(e) => setRangeText(e.target.value)}
                        placeholder="예: 1-3,5,8-10"
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-0 transition focus:border-sky-500"
                      />
                      <p className={`mt-2 text-xs ${rangeValidation.valid ? "text-emerald-600" : "text-rose-600"}`}>
                        {rangeValidation.message}
                      </p>
                    </div>
                  )}

                  {splitMode === "chunk" && (
                    <div className="mt-4">
                      <label htmlFor="chunk-size" className="mb-2 block text-sm font-medium">
                        분할 단위 (페이지 수)
                      </label>
                      <input
                        id="chunk-size"
                        type="number"
                        min={1}
                        value={chunkSize}
                        onChange={(e) => setChunkSize(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-0 transition focus:border-sky-500"
                      />
                    </div>
                  )}
                </div>
              )}
            </section>

            <aside className="space-y-6">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold">실행 패널</h2>
                <p className="mt-1 text-sm text-slate-600">
                  현재는 UI/UX 프로토타입입니다. 실제 PDF 엔진 연결 전 단계에서 사용자 흐름을 검증합니다.
                </p>

                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
                  <dl className="space-y-2">
                    <div className="flex justify-between gap-4">
                      <dt className="text-slate-500">모드</dt>
                      <dd className="font-medium">{toolMode === "merge" ? "PDF 병합" : "PDF 분리"}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-slate-500">선택 파일 수</dt>
                      <dd className="font-medium">{files.length}개</dd>
                    </div>
                    {toolMode === "split" && (
                      <div className="flex justify-between gap-4">
                        <dt className="text-slate-500">분리 방식</dt>
                        <dd className="font-medium">
                          {splitMode === "range" ? "범위" : splitMode === "single" ? "개별 페이지" : "N페이지 단위"}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>

                <button
                  type="button"
                  onClick={runDemo}
                  disabled={isRunning || (toolMode === "merge" ? !canRunMerge : !canRunSplit)}
                  className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition enabled:hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {isRunning
                    ? `${toolMode === "merge" ? "병합" : "분리"} 진행 중...`
                    : `${toolMode === "merge" ? "병합" : "분리"} 실행 (데모)`}
                </button>

                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="text-slate-500">진행 상태</span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-600 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold">UI/UX 포인트</h2>
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  <li>입력 오류를 즉시 피드백 (페이지 범위 형식 검증)</li>
                  <li>파일 정렬 버튼 제공 (키보드/마우스 모두 접근 가능)</li>
                  <li>명확한 상태 표시 (실행 버튼 활성화 조건 + 진행률)</li>
                  <li>모드 전환 시 불필요한 파일 정리 (분리 모드 1개 유지)</li>
                </ul>
              </section>
            </aside>
          </div>
        </div>
      </section>
    </main>
  )
}
