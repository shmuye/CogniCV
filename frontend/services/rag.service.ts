const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function sendMessage(message: string) {
  const res = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  })

  if (!res.ok) {
    throw new Error('Failed to fetch response')
  }

  return res.json()
}