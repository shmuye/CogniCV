const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
import axios from 'axios'

export async function sendMessage(message: string) {
  const res = await axios.post(`${API_URL}/chat`, { message })
  return res.data
} 
    