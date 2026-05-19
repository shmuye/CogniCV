import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex items-center justify-center h-screen">
      <Link
        href="/chat"
        className="bg-blue-600 text-white px-6 py-3 rounded-xl"
      >
        Start Chat
      </Link>
    </main>
  )
}