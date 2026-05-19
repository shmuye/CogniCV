'use client'

import { useRef, useState } from 'react'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function FileUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)

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

      const res = await axios.post(`${API_URL}/upload`, formData)
      if (!res.data) throw new Error()

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="p-2 rounded-lg hover:bg-gray-700 transition"
      >
        ➕
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