const HistoryPanel = ({ items, onSelect, onClear }) => {
  const formatDate = (ts) => {
    const d = new Date(ts)
    return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Historial</h3>
        <button
          onClick={onClear}
          className="text-xs text-slate-600 hover:text-red-400 transition-colors"
        >
          Limpiar
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <button
            key={item.url}
            onClick={() => onSelect(item)}
            className="w-full flex items-center gap-3 p-3 bg-slate-900/30 border border-slate-800 rounded-xl hover:bg-slate-800/50 transition-all text-left group"
          >
            <img
              src={item.thumbnail}
              alt=""
              className="w-14 aspect-video object-cover rounded-lg shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-300 truncate group-hover:text-white transition-colors">
                {item.title}
              </p>
              <p className="text-xs text-slate-600 mt-0.5">{formatDate(item.timestamp)}</p>
            </div>
            <svg className="w-4 h-4 text-slate-700 group-hover:text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  )
}

export default HistoryPanel
