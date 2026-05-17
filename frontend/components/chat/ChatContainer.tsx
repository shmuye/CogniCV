'use client'

import { useState } from 'react'
import { sendMessage } from '@/services/rag.service'
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
    <div className="flex flex-col h-screen max-w-3xl mx-auto p-4">
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-xl max-w-[80%] ${
              msg.role === 'user'
                ? 'ml-auto bg-black text-white'
                : 'bg-gray-100'
            }`}
          >
            {msg.content}
          </div>
        ))}

        {loading && (
          <div className="text-sm text-gray-500">
            Thinking...
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2 mt-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about the document..."
          className="flex-1 border rounded-xl px-4 py-2"
        />

        <button
          onClick={handleSend}
          className="bg-black text-white px-4 py-2 rounded-xl"
        >
          Send
        </button>
      </div>
    </div>
  )
}