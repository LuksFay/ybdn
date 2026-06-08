import { useState, useCallback } from 'react'
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
  const [token, setToken] = useState(() => {
    try { return localStorage.getItem('ybdn_google_token') || '' } catch { return '' }
  })
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ybdn_history') || '[]')
    } catch { return [] }
  })

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

  const handleTokenChange = useCallback((val) => {
    setToken(val)
    localStorage.setItem('ybdn_google_token', val)
  }, [])

  const handleSubmit = async (url) => {
    setLoading(true)
    setError('')
    setVideoData(null)
    setSelectedFormat(null)
    setCurrentUrl(url)

    try {
      const data = await getVideoInfo(url, token || undefined)
      setVideoData(data)
      addToHistory({ url, title: data.title, thumbnail: data.thumbnail, timestamp: Date.now() })
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
      <Header />

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
            <VideoInfo data={videoData} />

            {videoData._formatError && (
              <div className="p-4 bg-yellow-900/30 border border-yellow-700 rounded-xl">
                <CookieInput token={token} onTokenChange={handleTokenChange} />
              </div>
            )}

            {videoData.formats?.length > 0 ? (
              <>
                <FormatSelector
                  formats={videoData.formats}
                  selected={selectedFormat}
                  onSelect={setSelectedFormat}
                />
                <DownloadButton
                  url={currentUrl}
                  itag={selectedFormat}
                  filename={videoData.title}
                  token={token}
                />
              </>
            ) : !videoData._formatError && (
              <p className="text-center text-slate-500 text-sm">
                No hay formatos disponibles para este video.
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
