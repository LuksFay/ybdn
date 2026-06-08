import { useState } from 'react'
import { getDownloadUrl } from '../utils/api'

const DownloadButton = ({ url, itag, filename, token }) => {
  const [status, setStatus] = useState('idle')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')

  const handleDownload = async () => {
    if (!itag) return
    setStatus('downloading')
    setProgress(0)
    setError('')

    try {
      const downloadUrl = getDownloadUrl(url, itag, token || undefined)
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {}
      const response = await fetch(downloadUrl, { headers })

      if (!response.ok) {
        throw new Error(`Error ${response.status}`)
      }

      const contentLength = response.headers.get('content-length')
      const total = contentLength ? parseInt(contentLength) : 0
      const chunks = []
      let loaded = 0

      const reader = response.body.getReader()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        chunks.push(value)
        loaded += value.length
        if (total) setProgress(Math.round((loaded / total) * 100))
      }

      const blob = new Blob(chunks)
      const blobUrl = URL.createObjectURL(blob)

      const disposition = response.headers.get('content-disposition') || ''
      const match = disposition.match(/filename="?(.+?)"?$/)
      const name = match?.[1] || `${filename || 'video'}.mp4`

      const a = document.createElement('a')
      a.href = blobUrl
      a.download = name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000)

      setStatus('done')
      setTimeout(() => setStatus('idle'), 3000)
    } catch (err) {
      setError(err.message)
      setStatus('error')
      setTimeout(() => setStatus('idle'), 4000)
    }
  }

  return (
    <div className="flex flex-col items-center gap-3 pt-4">
      <button
        onClick={handleDownload}
        disabled={!itag || status === 'downloading'}
        className={`px-12 py-4 rounded-full font-bold text-white shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:transform-none ${
          status === 'downloading'
            ? 'bg-slate-600 cursor-wait'
            : status === 'done'
              ? 'bg-green-600'
              : status === 'error'
                ? 'bg-red-800'
                : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400'
        }`}
      >
        {status === 'idle' && 'Descargar'}
        {status === 'downloading' && (progress > 0 ? `Descargando ${progress}%` : 'Preparando...')}
        {status === 'done' && 'Descargado'}
        {status === 'error' && 'Error'}
      </button>

      {status === 'downloading' && progress > 0 && (
        <div className="w-full max-w-xs bg-slate-800 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  )
}

export default DownloadButton
