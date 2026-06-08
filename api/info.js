import ytdl from '@distube/ytdl-core'

function parseCookies(raw) {
  if (!raw || typeof raw !== 'string') return null
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed
  } catch {}
  return null
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'X-YBDN-Cookies, Authorization')

  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
    return
  }

  const url = req.query?.url
  const rawCookies = req.headers['x-ybdn-cookies'] || req.query?.cookies
  const authHeader = req.headers['authorization']

  if (!url) {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Falta el parámetro "url"' }))
    return
  }

  try {
    const opts = {
      requestOptions: {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        },
      },
    }

    if (authHeader) {
      opts.requestOptions.headers['Authorization'] = authHeader
    }

    const cookies = parseCookies(rawCookies)
    if (cookies) {
      opts.agent = ytdl.createAgent(cookies)
    }

    const basicInfo = await ytdl.getBasicInfo(url, opts)

    const result = {
      title: basicInfo.videoDetails.title,
      thumbnail: basicInfo.videoDetails.thumbnails?.at(-1)?.url || null,
      duration: basicInfo.videoDetails.lengthSeconds,
      author: basicInfo.videoDetails.author?.name || 'Desconocido',
      formats: [],
    }

    try {
      const fullInfo = await ytdl.getInfo(url, opts)
      result.formats = fullInfo.formats
        .filter(f => f.mimeType && f.hasAudio && f.url)
        .map(f => ({
          itag: f.itag,
          quality: f.qualityLabel || (f.audioBitrate ? `${f.audioBitrate}kbps` : 'desconocido'),
          container: f.container,
          contentLength: f.contentLength,
          hasVideo: f.hasVideo,
          hasAudio: f.hasAudio,
          mimeType: f.mimeType,
        }))
    } catch (formatErr) {
      const msg = formatErr.message?.toLowerCase() || ''
      if (msg.includes('playable formats')) {
        result._formatError = cookies
          ? 'No se pudieron obtener formatos incluso con cookies. Pueden haber expirado.'
          : 'Video con restricción. Agregá tus cookies de YouTube para descargar.'
      } else if (msg.includes('age') || msg.includes('sign in')) {
        result._formatError = 'Video con restricción de edad. Agregá tus cookies de YouTube para descargar.'
      } else {
        result._formatError = 'No se pudieron obtener los formatos de descarga.'
      }
    }

    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(result))
  } catch (err) {
    console.error('Error en /api/info:', err.message)
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: `Error: ${err.message}` }))
  }
}
