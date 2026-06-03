import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default function Home() {
  // optional improvement later: check token from cookies
  redirect('/chat')
}