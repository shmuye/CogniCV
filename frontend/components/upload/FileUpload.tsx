'use client'

import { useState } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleUpload = async () => {
    if (!file) return

    setLoading(true)
    setMessage('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        throw new Error('Upload failed')
      }

      const data = await res.json()

      setMessage(data.message || 'Upload successful')
    } catch (err) {
      console.error(err)
      setMessage('Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border rounded-xl p-4 space-y-4 bg-white shadow">
      
      <h2 className="font-semibold text-lg">
        Upload Resume (PDF)
      </h2>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            setFile(e.target.files[0])
          }
        }}
        className="block w-full"
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded-xl"
      >
        {loading ? 'Uploading...' : 'Upload'}
      </button>

      {message && (
        <p className="text-sm text-gray-600">
          {message}
        </p>
      )}
    </div>
  )
}