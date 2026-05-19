'use client'

import { useState } from 'react'
import { sendMessage } from '@/services/rag.service'
import FileUpload from '../upload/FileUpload'
import type { Message } from '@/types/chat'

export default function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      role: 'user',
      content: input,
    }

    setMessages(prev => [...prev, userMessage])
    setLoading(true)

    try {
      const res = await sendMessage(input)

      const botMessage: Message = {
        role: 'assistant',
        content: res.answer,
      }

      setMessages(prev => [...prev, botMessage])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
      setInput('')
    }
  }

  return (
    <div className="flex flex-col h-screen">

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 max-w-3xl mx-auto w-full">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`px-4 py-3 rounded-2xl max-w-[75%] ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-200'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-gray-400 text-sm">
            Thinking...
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="border-t border-gray-700 p-4">
        <div className="flex items-center gap-3 max-w-3xl mx-auto">

          <FileUpload />

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about the document..."
            className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-xl outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend()
            }}
          />

          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-blue-600 px-4 py-2 rounded-xl text-white"
          >
            Send
          </button>

        </div>
      </div>
    </div>
  )
}