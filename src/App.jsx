import { useState, useEffect, useCallback } from 'react'
import Header from './components/Header'
import UrlInput from './components/UrlInput'
import VideoInfo from './components/VideoInfo'
import FormatSelector from './components/FormatSelector'
import DownloadButton from './components/DownloadButton'
import CookieInput from './components/CookieInput'
import HistoryPanel from './components/HistoryPanel'
import Footer from './components/Footer'
import { getVideoInfo } from './utils/api'

function App() {
  const [videoData, setVideoData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedFormat, setSelectedFormat] = useState(null)
  const [currentUrl, setCurrentUrl] = useState('')
  const [cookies, setCookies] = useState(() => {
    try { return localStorage.getItem('ybdn_cookies') || '' } catch { return '' }
  })
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ybdn_history') || '[]')
    } catch { return [] }
  })

  // Importar cookies via bookmarklet (?import-cookies=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const importData = params.get('import-cookies')
    if (importData) {
      try {
        const parsed = JSON.parse(importData)
        if (Array.isArray(parsed) && parsed.length > 0) {
          const json = JSON.stringify(parsed)
          localStorage.setItem('ybdn_cookies', json)
          setCookies(json)
          window.history.replaceState({}, '', window.location.pathname)
        }
      } catch {}
    }
  }, [])

  const reset = useCallback(() => {
    setVideoData(null)
    setLoading(false)
    setError('')
    setSelectedFormat(null)
    setCurrentUrl('')
  }, [])

  const addToHistory = useCallback((item) => {
    setHistory(prev => {
      const filtered = prev.filter(h => h.url !== item.url)
      const updated = [item, ...filtered].slice(0, 20)
      localStorage.setItem('ybdn_history', JSON.stringify(updated))
      return updated
    })
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    localStorage.removeItem('ybdn_history')
  }, [])

  const handleCookiesChange = useCallback((val) => {
    setCookies(val)
    localStorage.setItem('ybdn_cookies', val)
  }, [])

  const handleSubmit = async (url) => {
    setLoading(true)
    setError('')
    setVideoData(null)
    setSelectedFormat(null)
    setCurrentUrl(url)

    try {
      const data = await getVideoInfo(url, cookies || undefined)
      setVideoData(data)
      if (data.title) {
        addToHistory({ url, title: data.title, thumbnail: data.thumbnail, timestamp: Date.now() })
      }
      if (data.formats?.length > 0) {
        setSelectedFormat(data.formats[0].itag)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleHistorySelect = (item) => {
    handleSubmit(item.url)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header onReset={reset} />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-10">
        <UrlInput onSubmit={handleSubmit} loading={loading} />

        {error && (
          <div className="mt-6 p-4 bg-red-900/40 border border-red-700 rounded-xl text-red-300 text-sm">
            {error}
          </div>
        )}

        {loading && (
          <div className="mt-10 flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Obteniendo información del video...</p>
          </div>
        )}

        {videoData && !loading && (
          <div className="mt-8 space-y-6">
            {videoData.title && <VideoInfo data={videoData} />}

            {videoData._formatError ? (
              <div className="p-4 bg-yellow-900/30 border border-yellow-700 rounded-xl">
                <CookieInput cookies={cookies} onCookiesChange={handleCookiesChange} />
              </div>
            ) : videoData.formats?.length > 0 ? (
              <>
                <p className="text-xs text-slate-500">
                  {videoData.formats.length} formatos disponibles
                </p>
                <FormatSelector
                  formats={videoData.formats}
                  selected={selectedFormat}
                  onSelect={setSelectedFormat}
                />
                <DownloadButton
                  url={currentUrl}
                  itag={selectedFormat}
                  filename={videoData.title}
                  cookies={cookies}
                />
              </>
            ) : (
              <p className="text-center text-slate-500 text-sm">
                No se encontraron formatos de descarga.
              </p>
            )}
          </div>
        )}

        {history.length > 0 && !videoData && !loading && (
          <HistoryPanel items={history} onSelect={handleHistorySelect} onClear={clearHistory} />
        )}
      </main>

      <Footer />
    </div>
  )
}

export default App
