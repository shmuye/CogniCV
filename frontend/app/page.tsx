import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex items-center justify-center h-screen">
      <Link
        href="/chat"
        className="px-6 py-3 bg-black text-white rounded-xl"
      >
        Open Chat
      </Link>
    </main>
  )
}