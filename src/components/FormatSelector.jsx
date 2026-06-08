const FormatSelector = ({ formats, selected, onSelect }) => {
  if (!formats?.length) return null

  const audioFormats = formats.filter(f => !f.hasVideo && f.hasAudio)
  const videoFormats = formats.filter(f => f.hasVideo && f.hasAudio)

  const formatSize = (bytes) => {
    if (!bytes) return ''
    const mb = parseInt(bytes) / (1024 * 1024)
    return mb > 1 ? ` ~${Math.round(mb)}MB` : ` ~${Math.round(mb * 1000)}KB`
  }

  return (
    <div className="space-y-4">
      {audioFormats.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Solo Audio</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {audioFormats.map((f) => (
              <button
                key={f.itag}
                onClick={() => onSelect(f.itag)}
                className={`px-4 py-3 rounded-lg text-left text-sm border transition-all ${
                  selected === f.itag
                    ? 'bg-red-600/20 border-red-500 text-red-300'
                    : 'bg-slate-900/50 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                <div className="font-medium">{f.quality}</div>
                <div className="text-xs text-slate-500">{f.container}{formatSize(f.contentLength)}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {videoFormats.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Video + Audio</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {videoFormats.map((f) => (
              <button
                key={f.itag}
                onClick={() => onSelect(f.itag)}
                className={`px-4 py-3 rounded-lg text-left text-sm border transition-all ${
                  selected === f.itag
                    ? 'bg-red-600/20 border-red-500 text-red-300'
                    : 'bg-slate-900/50 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                <div className="font-medium">{f.quality}</div>
                <div className="text-xs text-slate-500">{f.container}{formatSize(f.contentLength)}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FormatSelector
