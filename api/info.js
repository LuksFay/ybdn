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
    const baseHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    }

    const cookies = parseCookies(rawCookies)
    const agent = cookies ? ytdl.createAgent(cookies) : undefined

    // getBasicInfo: sin token, solo metadatos
    const basicInfo = await ytdl.getBasicInfo(url, {
      requestOptions: { headers: { ...baseHeaders } },
      agent,
    })

    const result = {
      title: basicInfo.videoDetails.title,
      thumbnail: basicInfo.videoDetails.thumbnails?.at(-1)?.url || null,
      duration: basicInfo.videoDetails.lengthSeconds,
      author: basicInfo.videoDetails.author?.name || 'Desconocido',
      formats: [],
    }

    // getInfo: con token/cookies para formatos de descarga
    try {
      const infoOpts = {
        requestOptions: {
          headers: { ...baseHeaders },
        },
        agent,
      }
      if (authHeader) {
        infoOpts.requestOptions.headers['Authorization'] = authHeader
      }
      const fullInfo = await ytdl.getInfo(url, infoOpts)
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
        result._formatError = 'No se encontraron formatos. Las cookies pueden haber expirado o no ser suficientes.'
      } else if (msg.includes('age') || msg.includes('sign in')) {
        result._formatError = 'Requiere inicio de sesión en YouTube.'
      } else {
        result._formatError = formatErr.message?.substring(0, 120) || 'Error desconocido al obtener formatos.'
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
