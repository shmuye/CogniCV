'use client'

import { useState } from 'react'

import ReactMarkdown from 'react-markdown'

import {
  ArrowUp,
  FileText,
} from 'lucide-react'

import { streamMessage } from '@/services/rag.service'

import FileUpload from '../upload/FileUpload'

import type { Message } from '@/types/chat'

export default function ChatContainer() {
  const [messages, setMessages] = useState<
    Message[]
  >([])

  const [input, setInput] = useState('')

  const [loading, setLoading] =
    useState(false)

  const [uploadedFile, setUploadedFile] =
    useState<string | null>(null)

  const hasMessages = messages.length > 0

  const handleSend = async () => {
    if (!input.trim()) return

    const currentInput = input

    const userMessage: Message = {
      role: 'user',
      content: currentInput,
    }

    setMessages((prev) => [
      ...prev,
      userMessage,
      {
        role: 'assistant',
        content: '',
      },
    ])

    setInput('')
    setLoading(true)

    const assistantIndex =
      messages.length + 1

    try {
      await streamMessage(
        currentInput,
        (chunk) => {
          setMessages((prev) => {
            const updated = [...prev]

            updated[
              assistantIndex
            ].content += chunk

            return updated
          })
        }
      )
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-[#042930] text-white">

      {/* Messages */}
      {hasMessages && (
        <div className="flex-1 overflow-y-auto px-4 py-8">
          <div className="max-w-3xl mx-auto space-y-8">

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === 'user'
                    ? 'justify-end'
                    : 'justify-start'
                }`}
              >
                <div
                  className={`px-5 py-4 rounded-3xl max-w-[85%] whitespace-pre-wrap leading-8 ${
                    msg.role === 'user'
                      ? 'bg-[#060609ca]'
                      : 'bg-transparent'
                  }`}
                >
                  <ReactMarkdown>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}

            {loading && (
              <div className="text-gray-400 animate-pulse">
                Thinking...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Centered Initial Layout */}
      {!hasMessages && (
        <div className="flex-1 flex flex-col items-center justify-center px-4">

          <h1 className="text-3xl font-semibold mb-10 text-center">
            Ask anything about your resume
          </h1>

          <div className="w-full max-w-3xl">
            <InputBar
              input={input}
              setInput={setInput}
              handleSend={handleSend}
              uploadedFile={uploadedFile}
              setUploadedFile={setUploadedFile}
            />
          </div>
        </div>
      )}

      {/* Bottom Layout */}
      {hasMessages && (
        <div className="border-t border-gray-800 px-4 py-4">
          <div className="max-w-3xl mx-auto">
            <InputBar
              input={input}
              setInput={setInput}
              handleSend={handleSend}
              uploadedFile={uploadedFile}
              setUploadedFile={setUploadedFile}
            />
          </div>
        </div>
      )}
    </div>
  )
}

interface InputBarProps {
  input: string
  setInput: React.Dispatch<
    React.SetStateAction<string>
  >
  handleSend: () => void
  uploadedFile: string | null
  setUploadedFile: (
    file: string | null
  ) => void
}

function InputBar({
  input,
  setInput,
  handleSend,
  uploadedFile,
  setUploadedFile,
}: InputBarProps) {
  return (
    <div className="bg-[#09056a] rounded-3xl p-3">

      {/* Uploaded File */}
      {uploadedFile && (
        <div
          className="
            flex
            items-center
            gap-2
            bg-[#404040]
            w-fit
            px-3
            py-2
            rounded-xl
            mb-3
          "
        >
          <FileText size={18} />

          <span className="text-sm">
            {uploadedFile}
          </span>
        </div>
      )}

      {/* Input Row */}
      <div className="flex items-center gap-2">

        <FileUpload
          onUploadSuccess={(fileName) =>
            setUploadedFile(fileName)
          }
        />

        <input
          value={input}
          onChange={(e) =>
            setInput(e.target.value)
          }
          placeholder="Ask anything..."
          className="
            flex-1
            bg-transparent
            outline-none
            px-2
            text-white
            placeholder:text-gray-400
          "
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSend()
            }
          }}
        />

        <button
          onClick={handleSend}
          className="
            bg-white
            text-black
            p-2
            rounded-full
            hover:opacity-80
            transition
          "
        >
          <ArrowUp size={18} />
        </button>

      </div>
    </div>
  )
}