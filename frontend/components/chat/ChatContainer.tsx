'use client'

import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import ReactMarkdown from 'react-markdown'

import {
  ArrowUp,
  FileText,
  MessageSquare,
  Plus,
  Trash2,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'

import { streamMessage } from '@/services/rag.service'

import FileUpload from '../upload/FileUpload'

import type {
  Conversation,
  Message,
} from '@/types/chat'

const CONVERSATIONS_STORAGE_KEY =
  'resume-assistant-conversations'

const ACTIVE_CHAT_STORAGE_KEY =
  'resume-assistant-active-chat'

export default function ChatContainer() {
  const [conversations, setConversations] =
    useState<Conversation[]>([])

  const [activeConversationId, setActiveConversationId] =
    useState<string | null>(null)

  const [input, setInput] = useState('')

  const [loading, setLoading] =
    useState(false)

  const [hydrated, setHydrated] =
    useState(false)

  const [sidebarOpen, setSidebarOpen] =
    useState(true)

  // =========================
  // Hydration
  // =========================

  useEffect(() => {
    const savedConversations =
      localStorage.getItem(
        CONVERSATIONS_STORAGE_KEY
      )

    const savedActiveChat =
      localStorage.getItem(
        ACTIVE_CHAT_STORAGE_KEY
      )

    if (savedConversations) {
      const parsed =
        JSON.parse(savedConversations)

      setConversations(parsed)

      if (
        savedActiveChat &&
        parsed.some(
          (c: Conversation) =>
            c.id === savedActiveChat
        )
      ) {
        setActiveConversationId(
          savedActiveChat
        )
      } else if (parsed.length > 0) {
        setActiveConversationId(
          parsed[0].id
        )
      }
    }

    setHydrated(true)
  }, [])

  // =========================
  // Persistence
  // =========================

  useEffect(() => {
    if (!hydrated) return

    localStorage.setItem(
      CONVERSATIONS_STORAGE_KEY,
      JSON.stringify(conversations)
    )
  }, [conversations, hydrated])

  useEffect(() => {
    if (!hydrated) return

    if (activeConversationId) {
      localStorage.setItem(
        ACTIVE_CHAT_STORAGE_KEY,
        activeConversationId
      )
    }
  }, [activeConversationId, hydrated])

  // =========================
  // Active conversation
  // =========================

  const activeConversation =
    useMemo(() => {
      return conversations.find(
        (conversation) =>
          conversation.id ===
          activeConversationId
      )
    }, [
      conversations,
      activeConversationId,
    ])

  const messages =
    activeConversation?.messages || []

  const uploadedFile =
    activeConversation?.uploadedFile ||
    null

  const hasMessages = messages.length > 0

  // =========================
  // New Chat
  // =========================

  const createNewConversation = () => {
    const newConversation: Conversation =
      {
        id: crypto.randomUUID(),
        title: 'New Chat',
        messages: [],
        uploadedFile: null,
        createdAt: Date.now(),
      }

    setConversations((prev) => [
      newConversation,
      ...prev,
    ])

    setActiveConversationId(
      newConversation.id
    )

    setInput('')
  }

  // =========================
  // Update conversation
  // =========================

  const updateConversation = (
    conversationId: string,
    updater: (
      conversation: Conversation
    ) => Conversation
  ) => {
    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id ===
        conversationId
          ? updater(conversation)
          : conversation
      )
    )
  }

  // =========================
  // Send message
  // =========================

  const handleSend = async () => {
    if (!input.trim()) return

    let conversationId =
      activeConversationId

    // create chat automatically
    if (!conversationId) {
      const newConversation: Conversation =
        {
          id: crypto.randomUUID(),
          title: input.slice(0, 30),
          messages: [],
          uploadedFile: null,
          createdAt: Date.now(),
        }

      setConversations((prev) => [
        newConversation,
        ...prev,
      ])

      setActiveConversationId(
        newConversation.id
      )

      conversationId =
        newConversation.id
    }

    if (!conversationId) return

    const currentInput = input

    const userMessage: Message = {
      role: 'user',
      content: currentInput,
    }

    const assistantMessage: Message = {
      role: 'assistant',
      content: '',
    }

    setInput('')
    setLoading(true)

    updateConversation(
      conversationId,
      (conversation) => ({
        ...conversation,
        title:
          conversation.messages.length ===
          0
            ? currentInput.slice(0, 30)
            : conversation.title,
        messages: [
          ...conversation.messages,
          userMessage,
          assistantMessage,
        ],
      })
    )

    try {
      await streamMessage(
        currentInput,
        (chunk) => {
          setConversations((prev) =>
            prev.map((conversation) => {
              if (
                conversation.id !==
                conversationId
              ) {
                return conversation
              }

              const updatedMessages =
                [
                  ...conversation.messages,
                ]

              updatedMessages[
                updatedMessages.length - 1
              ] = {
                role: 'assistant',
                content: chunk,
              }

              return {
                ...conversation,
                messages:
                  updatedMessages,
              }
            })
          )
        }
      )
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // =========================
  // Delete chat
  // =========================

  const deleteConversation = (
    id: string
  ) => {
    const filtered =
      conversations.filter(
        (conversation) =>
          conversation.id !== id
      )

    setConversations(filtered)

    if (
      activeConversationId === id
    ) {
      setActiveConversationId(
        filtered[0]?.id || null
      )
    }
  }

  // =========================
  // Upload callback
  // =========================

  const handleUploadSuccess = (
    fileName: string
  ) => {
    if (!activeConversationId) return

    updateConversation(
      activeConversationId,
      (conversation) => ({
        ...conversation,
        uploadedFile: fileName,
      })
    )
  }

  return (
    <div className="h-screen bg-[#042930] text-white flex overflow-hidden">

      {/* Sidebar */}
      <aside
        className={`
          border-r border-gray-800
          bg-[#031d22]
          transition-all duration-300
          flex flex-col
          ${
            sidebarOpen
              ? 'w-[280px]'
              : 'w-[70px]'
          }
        `}
      >
        {/* Top */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          {sidebarOpen && (
            <button
              onClick={
                createNewConversation
              }
              className="
                flex
                items-center
                gap-2
                bg-[#0b3b45]
                hover:bg-[#114b57]
                transition
                rounded-xl
                px-4
                py-3
                text-sm
                w-full
              "
            >
              <Plus size={18} />
              New Chat
            </button>
          )}

          <button
            onClick={() =>
              setSidebarOpen(
                !sidebarOpen
              )
            }
            className="ml-2 p-2 hover:bg-gray-700 rounded-lg transition"
          >
            {sidebarOpen ? (
              <PanelLeftClose
                size={18}
              />
            ) : (
              <PanelLeftOpen
                size={18}
              />
            )}
          </button>
        </div>

        {/* Chats */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {conversations.map(
  (conversation) => (
    <div
      key={conversation.id}
      className={`
        w-full
        rounded-xl
        transition
        flex
        items-center
        gap-2
        ${
          activeConversationId ===
          conversation.id
            ? 'bg-[#114b57]'
            : 'hover:bg-[#0b3b45]'
        }
      `}
    >
      {/* Chat Button */}
      <button
        onClick={() =>
          setActiveConversationId(
            conversation.id
          )
        }
        className="
          flex-1
          text-left
          p-3
          flex
          items-start
          gap-3
          min-w-0
        "
      >
        <MessageSquare
          size={18}
          className="mt-1 shrink-0"
        />

        {sidebarOpen && (
          <div className="min-w-0">
            <p className="truncate text-sm">
              {conversation.title}
            </p>

            <p className="text-xs text-gray-400 mt-1">
              {
                conversation.messages
                  .length
              }{' '}
              messages
            </p>
          </div>
        )}
      </button>

      {/* Delete Button */}
      {sidebarOpen && (
        <button
          onClick={() =>
            deleteConversation(
              conversation.id
            )
          }
          className="
            p-2
            mr-2
            hover:text-red-400
            transition
            shrink-0
          "
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  )
)}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">

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
                uploadedFile={
                  uploadedFile
                }
                onUploadSuccess={
                  handleUploadSuccess
                }
              />
            </div>
          </div>
        )}

        {/* Messages */}
        {hasMessages && (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-8">
              <div className="max-w-3xl mx-auto space-y-8">
                {messages.map(
                  (msg, i) => (
                    <div
                      key={i}
                      className={`flex ${
                        msg.role ===
                        'user'
                          ? 'justify-end'
                          : 'justify-start'
                      }`}
                    >
                      <div
                        className={`
                            px-5
                            py-4
                            rounded-3xl
                            max-w-[85%]
                            whitespace-pre-wrap
                            leading-8
                            ${
                              msg.role ===
                              'user'
                                ? 'bg-[#060609ca]'
                                : 'bg-transparent'
                            }
                          `}
                      >
                        <ReactMarkdown>
                          {
                            msg.content
                          }
                        </ReactMarkdown>
                      </div>
                    </div>
                  )
                )}

                {loading && (
                  <div className="text-gray-400 animate-pulse">
                    Thinking...
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-800 px-4 py-4">
              <div className="max-w-3xl mx-auto">
                <InputBar
                  input={input}
                  setInput={setInput}
                  handleSend={
                    handleSend
                  }
                  uploadedFile={
                    uploadedFile
                  }
                  onUploadSuccess={
                    handleUploadSuccess
                  }
                />
              </div>
            </div>
          </>
        )}
      </main>
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
  onUploadSuccess: (
    fileName: string
  ) => void
}

function InputBar({
  input,
  setInput,
  handleSend,
  uploadedFile,
  onUploadSuccess,
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

          <span className="text-sm truncate max-w-[200px]">
            {uploadedFile}
          </span>
        </div>
      )}

      {/* Input Row */}
      <div className="flex items-center gap-2">

        <FileUpload
          onUploadSuccess={
            onUploadSuccess
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
            if (
              e.key === 'Enter'
            ) {
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