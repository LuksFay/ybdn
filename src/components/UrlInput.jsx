import { useState } from 'react'

const UrlInput = ({ onSubmit, loading }) => {
  const [value, setValue] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const url = value.trim()
    if (!url) return
    onSubmit(url)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1 relative">
        <input
          type="url"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Pegá el link de YouTube aquí..."
          disabled={loading}
          className="w-full px-5 py-4 pr-12 bg-slate-900/60 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all disabled:opacity-50 text-base"
        />
        <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <button
        type="submit"
        disabled={loading || !value.trim()}
        className="px-8 py-4 bg-red-600 hover:bg-red-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 disabled:transform-none shadow-lg shadow-red-900/30 whitespace-nowrap"
      >
        {loading ? 'Buscando...' : 'Obtener'}
      </button>
    </form>
  )
}

export default UrlInput
