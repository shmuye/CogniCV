'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { getToken } from '@/lib/auth'

export default function Home() {
  const router = useRouter()

  // useEffect(() => {
  //   if (getToken()) {
  //     router.push('/chat')
  //   }
  // }, [])

  return (
    <div className="h-screen w-full bg-[#042930] text-white flex items-center justify-center px-6">

      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-10 items-center">

        {/* LEFT SIDE */}
        <div className="space-y-6">

          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Cogni<span className="text-[#00d1c7]">CV</span>
          </h1>

          <p className="text-xl text-gray-300 leading-relaxed">
            Turn your resume into insights.
            <br />
            Ask smarter questions, uncover hidden strengths,
            and refine your career story with AI.
          </p>

          <p className="text-sm text-gray-400">
            Upload your CV. Ask anything. Improve everything.
          </p>

          <div className="flex gap-4 pt-4">

            <button
              onClick={() => router.push('/login')}
              className="
                px-6 py-3
                bg-[#00d1c7]
                text-black
                font-medium
                rounded-xl
                hover:opacity-90
                transition
              "
            >
              Get Started
            </button>

            <button
              onClick={() => router.push('/signup')}
              className="
                px-6 py-3
                border border-gray-500
                rounded-xl
                hover:border-white
                transition
              "
            >
              Create Account
            </button>

          </div>

        </div>

        {/* RIGHT SIDE (visual card) */}
        <div className="hidden md:flex justify-center">

          <div className="
            w-full max-w-md
            bg-[#031d22]
            border border-[#0b3b45]
            rounded-2xl
            p-6
            shadow-xl
            space-y-4
          ">

            <p className="text-sm text-gray-400">
              Example Insight
            </p>

            <div className="space-y-2">
              <p className="text-[#00d1c7] font-medium">
                Skills Detected
              </p>

              <ul className="text-sm text-gray-300 space-y-1">
                <li>• JavaScript</li>
                <li>• React</li>
                <li>• Problem Solving</li>
              </ul>
            </div>

            <div className="space-y-2 pt-3">
              <p className="text-[#00d1c7] font-medium">
                Suggestion
              </p>

              <p className="text-sm text-gray-300">
                Add measurable achievements to your
                experience section to strengthen impact.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}