import { useState, useCallback } from 'react'

const KEY_CLIENT_ID = 'ybdn_google_client_id'

const CookieInput = ({ token, onTokenChange }) => {
  const [clientId, setClientId] = useState(() => {
    try { return localStorage.getItem(KEY_CLIENT_ID) || '' } catch { return '' }
  })
  const [showInput, setShowInput] = useState(false)
  const [status, setStatus] = useState('')
  const [inputVal, setInputVal] = useState(clientId)

  const handleLogin = useCallback(() => {
    if (!clientId) {
      setShowInput(true)
      return
    }
    if (!window.google?.accounts?.oauth2) {
      setStatus('Error: la librería de Google no cargó')
      return
    }
    setStatus('Abriendo...')
    window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'https://www.googleapis.com/auth/youtube',
      callback: (response) => {
        if (response.error) { setStatus(`Error: ${response.error}`); return }
        if (response.access_token) {
          localStorage.setItem('ybdn_google_token', response.access_token)
          onTokenChange(response.access_token)
          setStatus('')
        }
      },
    }).requestAccessToken()
  }, [clientId, onTokenChange])

  const handleSaveClientId = () => {
    const val = inputVal.trim()
    localStorage.setItem(KEY_CLIENT_ID, val)
    setClientId(val)
    setShowInput(false)
    setStatus('')
  }

  const handleLogout = () => {
    localStorage.removeItem('ybdn_google_token')
    onTokenChange('')
  }

  return (
    <div className="mt-2 flex items-center gap-3 flex-wrap">
      <span className="text-sm text-yellow-300">Video con restricción.</span>
      {token ? (
        <>
          <span className="text-xs text-green-400">✓ Conectado</span>
          <button onClick={handleLogout} className="text-xs text-slate-500 underline hover:text-slate-300">
            Cerrar sesión
          </button>
        </>
      ) : (
        <>
          <button
            onClick={handleLogin}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-100 text-slate-800 text-sm font-medium rounded-lg shadow transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59A14.5 14.5 0 0 1 9.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.99 23.99 0 0 0 0 24c0 3.77.87 7.35 2.56 10.56l7.97-5.97z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 5.97C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Iniciar sesión con Google
          </button>

          {showInput && (
            <div className="flex items-center gap-2 w-full">
              <input
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Pegá tu Client ID de Google Cloud"
                className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 text-xs font-mono placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
              <button
                onClick={handleSaveClientId}
                disabled={!inputVal.trim()}
                className="px-3 py-2 bg-red-600 hover:bg-red-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-xs font-semibold rounded-lg"
              >
                OK
              </button>
            </div>
          )}

          <a
            href="https://console.cloud.google.com/apis/credentials"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-slate-500 hover:text-slate-300 underline"
          >
            ¿Cómo obtener tu Client ID?
          </a>
        </>
      )}
      {status && <span className="text-xs text-slate-400">{status}</span>}
    </div>
  )
}

export default CookieInput
