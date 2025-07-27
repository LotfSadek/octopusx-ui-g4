"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Upload } from "lucide-react"
import { cn } from "@/lib/utils"

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
      "text/plain": [".txt"],
      "text/csv": [".csv"],
      "application/json": [".json"],
      "text/xml": [".xml"],
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
      className={cn(
        "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
        isDragActive || dragActive
          ? "border-green-500 bg-green-500/10"
          : "border-green-500/30 hover:border-green-500/50 hover:bg-green-500/5",
      )}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center space-y-3">
        <div className="p-3 rounded-full bg-green-600/20 border border-green-500/30">
          <Upload className="h-6 w-6 text-green-400" />
        </div>

        <div>
          <p className="text-green-100 font-medium">Drop security files here or click to browse</p>
          <p className="text-green-400/70 text-sm mt-1">Supports PDF, TXT, CSV, JSON, XML, Excel files</p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-green-400/60">
          <span className="px-2 py-1 bg-green-600/10 rounded border border-green-500/20">Security Logs</span>
          <span className="px-2 py-1 bg-green-600/10 rounded border border-green-500/20">Threat Reports</span>
          <span className="px-2 py-1 bg-green-600/10 rounded border border-green-500/20">Incident Data</span>
        </div>
      </div>
    </div>
  )
}
