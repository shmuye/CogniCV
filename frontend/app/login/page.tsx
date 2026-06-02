'use client'

import { useState } from 'react'
import { login } from '@/services/auth.service'
import { setAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] =
    useState('')
  const router = useRouter()

  const handleLogin = async () => {
    const res = await login(email, password)

    if (res.access_token) {
      setAuth(res)
      router.push('/chat')
    }
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="space-y-4">
        <input
          placeholder="Email"
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />
        <input
          placeholder="Password"
          type="password"
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />
        <button onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  )
}