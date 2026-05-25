'use client'

import {
  useEffect,
  useState,
} from 'react'

import ReactMarkdown from 'react-markdown'

import {
  ArrowUp,
  FileText,
} from 'lucide-react'

import { streamMessage } from '@/services/rag.service'

import FileUpload from '../upload/FileUpload'

import type { Message } from '@/types/chat'

const CHAT_STORAGE_KEY =
  'resume-assistant-messages'

const FILE_STORAGE_KEY =
  'resume-assistant-file'

export default function ChatContainer() {
  const [messages, setMessages] = useState<
    Message[]
  >([])

  const [input, setInput] = useState('')

  const [loading, setLoading] =
    useState(false)

  const [uploadedFile, setUploadedFile] =
    useState<string | null>(null)

  const [hydrated, setHydrated] =
    useState(false)

  // =========================
  // Load persisted data
  // =========================

  useEffect(() => {
    const savedMessages =
      localStorage.getItem(
        CHAT_STORAGE_KEY
      )

    const savedFile =
      localStorage.getItem(
        FILE_STORAGE_KEY
      )

    if (savedMessages) {
      setMessages(
        JSON.parse(savedMessages)
      )
    }

    if (savedFile) {
      setUploadedFile(savedFile)
    }

    setHydrated(true)
  }, [])

  // =========================
  // Persist messages
  // =========================

  useEffect(() => {
    if (!hydrated) return

    localStorage.setItem(
      CHAT_STORAGE_KEY,
      JSON.stringify(messages)
    )
  }, [messages, hydrated])

  // =========================
  // Persist uploaded file
  // =========================

  useEffect(() => {
    if (!hydrated) return

    if (uploadedFile) {
      localStorage.setItem(
        FILE_STORAGE_KEY,
        uploadedFile
      )
    } else {
      localStorage.removeItem(
        FILE_STORAGE_KEY
      )
    }
  }, [uploadedFile, hydrated])

  const hasMessages = messages.length > 0

  // =========================
  // Send message
  // =========================

  const handleSend = async () => {
    if (!input.trim()) return

    const currentInput = input

    const userMessage: Message = {
      role: 'user',
      content: currentInput,
    }

    const assistantMessage: Message = {
      role: 'assistant',
      content: '',
    }

    const updatedMessages = [
      ...messages,
      userMessage,
      assistantMessage,
    ]

    setMessages(updatedMessages)

    setInput('')
    setLoading(true)

    const assistantIndex =
      updatedMessages.length - 1

    try {
      await streamMessage(
        currentInput,
        (chunk) => {
          setMessages((prev) => {
            const updated = [...prev]

            updated[
              assistantIndex
            ] = {
              ...updated[
                assistantIndex
              ],
              content: chunk,
            }

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

  // =========================
  // Clear chat
  // =========================

  const clearChat = () => {
    localStorage.removeItem(
      CHAT_STORAGE_KEY
    )

    localStorage.removeItem(
      FILE_STORAGE_KEY
    )

    setMessages([])
    setUploadedFile(null)
  }

  return (
    <div className="flex flex-col h-screen bg-[#042930] text-white">

      {/* Header */}
      <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="font-semibold text-lg">
          Resume Assistant
        </h1>

        {hasMessages && (
          <button
            onClick={clearChat}
            className="
              text-sm
              text-red-400
              hover:text-red-300
              transition
            "
          >
            Clear Chat
          </button>
        )}
      </div>

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

      {/* Empty State */}
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

      {/* Bottom Input */}
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