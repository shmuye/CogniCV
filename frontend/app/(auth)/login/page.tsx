'use client'

import { useState } from 'react'
import { login } from '@/services/auth.service'
import { setAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] =
    useState('')
  const [loading, setLoading] =
    useState(false)

  const router = useRouter()

  const handleLogin = async () => {
    if (!email || !password) return

    setLoading(true)

    try {
      const res = await login(email, password)

      if (res.access_token) {
        setAuth(res)
        router.push('/chat')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md bg-[#031d22] p-8 rounded-2xl shadow-lg space-y-6">

      <h1 className="text-2xl font-semibold text-center">
        Welcome Back
      </h1>

      <div className="space-y-4">
        <input
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="
            w-full
            px-4
            py-3
            rounded-lg
            bg-[#0b3b45]
            outline-none
            placeholder:text-gray-400
          "
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="
            w-full
            px-4
            py-3
            rounded-lg
            bg-[#0b3b45]
            outline-none
            placeholder:text-gray-400
          "
        />
      </div>

      <button
        onClick={handleLogin}
        disabled={loading}
        className="
          w-full
          bg-white
          text-black
          py-3
          rounded-lg
          hover:opacity-80
          transition
        "
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <p className="text-sm text-center text-gray-400">
        Don’t have an account? Signup (next step)
      </p>

    </div>
  )
}