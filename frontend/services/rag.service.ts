const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://127.0.0.1:8000'

export async function streamMessage(
  message: string,
  onChunk: (chunk: string) => void
) {
  const response = await fetch(
    `${API_URL}/chat/`,
    {
      method: 'POST',
      headers: {
        'Content-Type':
          'application/json',
      },
      body: JSON.stringify({
        message,
      }),
    }
  )

  if (!response.body) {
    throw new Error(
      'No response body'
    )
  }

  const reader =
    response.body.getReader()

  const decoder =
    new TextDecoder()

  while (true) {
    const { done, value } =
      await reader.read()

    if (done) break

    const chunk = decoder.decode(
      value
    )

    onChunk(chunk)
  }
}