"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, ImageIcon } from "lucide-react"

interface FileUploadProps {
  multiple?: boolean
  accept?: string
  onFilesChange?: (files: File[]) => void
  maxFiles?: number
  label?: string
  description?: string
}

export default function FileUpload({
  multiple = false,
  accept = "image/*",
  onFilesChange,
  maxFiles = 10,
  label = "파일 선택",
  description = "이미지 파일을 선택하세요",
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [dragOver, setDragOver] = useState(false)

  const handleFileChange = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return

    const newFiles = Array.from(selectedFiles)
    const updatedFiles = multiple ? [...files, ...newFiles].slice(0, maxFiles) : [newFiles[0]]

    setFiles(updatedFiles)
    onFilesChange?.(updatedFiles)
  }

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index)
    setFiles(updatedFiles)
    onFilesChange?.(updatedFiles)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFileChange(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver ? "border-black bg-gray-50" : "border-gray-300"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500 mb-2">{description}</p>
        <input
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={(e) => handleFileChange(e.target.files)}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
        >
          {label}
        </label>
        <p className="text-xs text-gray-400 mt-2">{multiple ? `최대 ${maxFiles}개 파일` : "1개 파일"} 업로드 가능</p>
      </div>

      {/* 선택된 파일 목록 */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">선택된 파일:</h4>
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded border">
              <div className="flex items-center gap-3">
                <ImageIcon className="w-4 h-4 text-gray-500" />
                <div>
                  <span className="text-sm text-gray-700">{file.name}</span>
                  <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => removeFile(index)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
