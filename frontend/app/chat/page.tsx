'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getToken } from '@/lib/auth'
import ChatContainer from '@/components/chat/ChatContainer'

export default function ChatPage() {
  const router = useRouter()

  useEffect(() => {
    if (!getToken()) {
      router.push('/login')
    }
  }, [])

  return <ChatContainer />
}