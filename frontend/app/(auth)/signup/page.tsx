'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signup } from '@/services/auth.service'

export default function SignupPage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] =
    useState('')
  const [password, setPassword] =
    useState('')
  const [loading, setLoading] =
    useState(false)

  const handleSignup = async () => {
    if (!name || !email || !password) return

    setLoading(true)

    try {
      const res = await signup(
        email,
        password,
      )

      if (res) {
        // after signup → go to login
        router.push('/login')
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
        Create Account
      </h1>

      <div className="space-y-4">

        <input
          placeholder="Full Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
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
        onClick={handleSignup}
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
        {loading ? 'Creating account...' : 'Sign Up'}
      </button>

      <p className="text-sm text-center text-gray-400">
        Already have an account?{' '}
        <span
          onClick={() =>
            router.push('/login')
          }
          className="text-white cursor-pointer underline"
        >
          Login
        </span>
      </p>

    </div>
  )
}