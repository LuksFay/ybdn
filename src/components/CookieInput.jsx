const CookieInput = ({ cookies, onCookiesChange }) => {
  const origin = window.location.origin
  const code = `javascript:void function(){var c=document.cookie.split(/;\\s*/).map(function(c){var p=c.indexOf('=');return{name:c.substring(0,p),value:c.substring(p+1),domain:'.youtube.com'}});window.location.href='${origin}/?import-cookies='+encodeURIComponent(JSON.stringify(c))}()`

  return (
    <div className="space-y-3">
      <p className="text-sm text-yellow-300">
        Este video requiere iniciar sesión en YouTube
      </p>
      {cookies ? (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs text-green-400">✓ Conectado</span>
          <button
            onClick={() => { localStorage.removeItem('ybdn_cookies'); onCookiesChange('') }}
            className="text-xs text-slate-500 underline hover:text-slate-300"
          >
            Cerrar sesión
          </button>
          <span className="text-xs text-slate-400">Buscá el video de nuevo</span>
        </div>
      ) : (
        <div className="bg-slate-800 rounded-lg p-4 space-y-3 max-w-lg text-xs">
          <p className="text-slate-300 font-medium text-sm">Pasos (una vez):</p>
          <ol className="space-y-2 text-slate-400">
            <li><span className="text-slate-300">1.</span> Copiá el código de abajo (click <span className="text-red-400">"Copiar"</span>)</li>
            <li><span className="text-slate-300">2.</span> Chrome → Click derecho en barra de marcadores → <span className="text-slate-300">Añadir página</span></li>
            <li><span className="text-slate-300">3.</span> Nombre: <span className="text-slate-300">YBDN</span> — en URL pegá el código</li>
            <li><span className="text-slate-300">4.</span> Andá a <span className="text-red-400">youtube.com</span> (logueado), clickeá el marcador</li>
            <li><span className="text-slate-300">5.</span> Te redirige solo a YBDN con las cookies</li>
          </ol>
          <div className="flex gap-2 pt-1">
            <input
              readOnly
              value={code}
              className="flex-1 px-3 py-2 bg-slate-900 border border-slate-600 rounded text-slate-200 font-mono text-xs"
              onClick={(e) => e.target.select()}
            />
            <button
              onClick={() => navigator.clipboard.writeText(code)}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded text-xs"
            >
              Copiar
            </button>
          </div>
          <details className="text-slate-500 pt-1">
            <summary className="cursor-pointer hover:text-slate-300">O instalar extensión Cookie-Editor</summary>
            <p className="mt-2 text-slate-400">Instalá <a href="https://chromewebstore.google.com/detail/cookie-editor/hlkenndednhfkekhgcdicdfddnkalmdm" target="_blank" rel="noreferrer" className="text-red-400 underline">Cookie-Editor</a>, andá a youtube.com, clickeá el ícono de la extensión → <span className="text-slate-300">Export</span> (formato JSON) → copiá y pegalo acá:</p>
            <textarea
              onChange={(e) => {
                try {
                  const p = JSON.parse(e.target.value)
                  if (Array.isArray(p) && p.length) {
                    localStorage.setItem('ybdn_cookies', JSON.stringify(p))
                    onCookiesChange(JSON.stringify(p))
                  }
                } catch {}
              }}
              placeholder='[{"name":"CONSENT","value":"YES+","domain":".youtube.com"}]'
              rows={2}
              className="w-full mt-2 px-3 py-2 bg-slate-900 border border-slate-600 rounded text-slate-200 font-mono text-xs placeholder-slate-600 focus:outline-none resize-none"
            />
          </details>
        </div>
      )}
    </div>
  )
}

export default CookieInput
