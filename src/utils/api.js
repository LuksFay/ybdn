const API_BASE = '/api'

export async function getVideoInfo(url, cookies) {
  const params = new URLSearchParams({ url })
  const headers = {}
  if (cookies) headers['X-YBDN-Cookies'] = cookies

  const res = await fetch(`${API_BASE}/info?${params}`, { headers })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Error desconocido' }))
    throw new Error(err.error || `HTTP ${res.status}`)
  }
  return res.json()
}

export function getDownloadUrl(url, itag, cookies) {
  const params = new URLSearchParams({ url, itag })
  if (cookies) params.set('cookies', cookies)
  return `${API_BASE}/download?${params}`
}
