'use client'

import { useRef, useState } from 'react'
import axios from 'axios'
import { Plus } from 'lucide-react'

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:8000'

interface Props {
  onUploadSuccess?: (fileName: string) => void
}

export default function FileUpload({
  onUploadSuccess,
}: Props) {
  const fileInputRef =
    useRef<HTMLInputElement>(null)

  const [loading, setLoading] =
    useState(false)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]

    if (!file) return

    setLoading(true)

    try {
      const formData = new FormData()

      formData.append('file', file)

      const res = await axios.post(
        `${API_URL}/upload/`,
        formData
      )

      if (!res.data) {
        throw new Error()
      }

      onUploadSuccess?.(file.name)

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="
          p-2
          rounded-full
          hover:bg-gray-700
          transition
        "
      >
        <Plus size={20} />
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        hidden
        onChange={handleFileChange}
      />

      {loading && (
        <span className="text-xs text-gray-400">
          Uploading...
        </span>
      )}
    </>
  )
}