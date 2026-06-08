const formatDuration = (seconds) => {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

const VideoInfo = ({ data }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-5 p-5 bg-slate-900/50 border border-slate-800 rounded-xl">
      <div className="shrink-0">
        <img
          src={data.thumbnail}
          alt={data.title}
          className="w-full sm:w-52 aspect-video object-cover rounded-lg shadow-lg"
        />
      </div>
      <div className="flex-1 min-w-0 space-y-2">
        <h2 className="text-lg font-bold text-white leading-snug line-clamp-2">
          {data.title}
        </h2>
        <p className="text-sm text-slate-400 flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          {data.author}
        </p>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="px-3 py-1 bg-slate-800 rounded-full text-slate-300">
            {formatDuration(data.duration)}
          </span>
          <span className="px-3 py-1 bg-slate-800 rounded-full text-slate-300">
            {data.formats?.length || 0} formatos disponibles
          </span>
        </div>
      </div>
    </div>
  )
}

export default VideoInfo
