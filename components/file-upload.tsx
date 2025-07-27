"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, type File } from "lucide-react"

interface FileUploadProps {
  onFileUpload: (files: File[]) => void
}

export function FileUpload({ onFileUpload }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFileUpload(acceptedFiles)
      setDragActive(false)
    },
    [onFileUpload],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "text/plain": [".txt", ".log"],
      "application/json": [".json"],
      "text/csv": [".csv"],
      "application/xml": [".xml"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
    },
    multiple: true,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  })

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
        isDragActive || dragActive
          ? "border-green-500 bg-green-900/20"
          : "border-gray-600 hover:border-green-500/50 hover:bg-gray-800/50"
      }`}
    >
      <input {...getInputProps()} />
      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
      <p className="text-sm text-gray-400 mb-2">
        {isDragActive ? "Drop files here..." : "Drag & drop files here, or click to select"}
      </p>
      <p className="text-xs text-gray-500">Supports: PDF, TXT, CSV, JSON, XML, Excel, Log files</p>
    </div>
  )
}
