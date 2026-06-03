'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getToken } from '@/lib/auth'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    if (!getToken()) {
      router.push('/login')
    }
  }, [])

  return (
    <div className="h-screen bg-[#042930] text-white">
      {children}
    </div>
  )
}