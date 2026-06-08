const API_BASE = '/api'

export async function getVideoInfo(url, token) {
  const params = new URLSearchParams({ url })
  const headers = {}
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_BASE}/info?${params}`, { headers })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Error desconocido' }))
    throw new Error(err.error || `HTTP ${res.status}`)
  }
  return res.json()
}

export function getDownloadUrl(url, itag, token) {
  const params = new URLSearchParams({ url, itag })
  if (token) params.set('token', token)
  return `${API_BASE}/download?${params}`
}
