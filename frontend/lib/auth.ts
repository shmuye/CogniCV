const TOKEN_KEY = 'token'
const USER_KEY = 'user'

export function setAuth(data: any) {
  localStorage.setItem(
    TOKEN_KEY,
    data.access_token
  )
  localStorage.setItem(
    USER_KEY,
    JSON.stringify(data.user)
  )
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getUser() {
  const user =
    localStorage.getItem(USER_KEY)
  return user ? JSON.parse(user) : null
}