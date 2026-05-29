'use client'

import { useRef, useState } from 'react'

import axios from 'axios'

import {
  Loader,
  Plus,
} from 'lucide-react'

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:8000'

interface Props {
  conversationId: string
  onUploadSuccess?: (
    fileName: string
  ) => void
}

export default function FileUpload({
  conversationId,
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
    const file =
      e.target.files?.[0]

    if (!file) return

    setLoading(true)

    try {
      const formData =
        new FormData()

      formData.append(
        'file',
        file
      )

      formData.append(
        'conversation_id',
        conversationId
      )

      const res = await axios.post(
        `${API_URL}/upload/`,
        formData
      )

      if (!res.data) {
        throw new Error()
      }

      onUploadSuccess?.(
        file.name
      )

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
        onChange={
          handleFileChange
        }
      />

      {loading && (
        <Loader
          size={20}
          className="animate-spin"
        />
      )}
    </>
  )
}