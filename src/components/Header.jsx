const Header = ({ onReset }) => {
  return (
    <header className="border-b border-slate-800 bg-[#0f0f11]/80 backdrop-blur-sm sticky top-0 z-10">
      <button onClick={onReset} className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity w-full text-left">
        <svg viewBox="0 0 100 100" className="w-8 h-8 shrink-0">
          <rect width="100" height="100" rx="20" fill="#dc2626"/>
          <polygon points="40,25 40,75 78,50" fill="white"/>
        </svg>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">ybdn</h1>
          <p className="text-xs text-slate-500 -mt-0.5">YouTube Downloader</p>
        </div>
      </button>
    </header>
  )
}

export default Header
