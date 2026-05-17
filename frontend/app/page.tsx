import FileUpload from '@/components/upload/FileUpload'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen gap-6">
      
      <FileUpload />

      <Link
        href="/chat"
        className="px-6 py-3 bg-black text-white rounded-xl"
      >
        Open Chat
      </Link>
    </main>
  )
}