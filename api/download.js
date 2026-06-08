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
  res.setHeader('Access-Control-Allow-Headers', 'Range, Authorization')

  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
    return
  }

  const url = req.query?.url
  const itag = req.query?.itag
  const rawCookies = req.query?.cookies
  const rawToken = req.query?.token

  if (!url || !itag) {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Faltan parámetros "url" y/o "itag"' }))
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

    if (rawToken) {
      opts.requestOptions.headers['Authorization'] = `Bearer ${rawToken}`
    }

    const cookies = parseCookies(rawCookies)
    if (cookies) {
      opts.agent = ytdl.createAgent(cookies)
    }

    const info = await ytdl.getInfo(url, opts)
    const format = info.formats.find(f => f.itag == itag)

    if (!format) {
      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Formato no encontrado.' }))
      return
    }

    const safeName = info.videoDetails.title
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 100)

    const ext = format.container || 'mp4'

    res.setHeader('Content-Disposition', `attachment; filename="${safeName}.${ext}"`)
    res.setHeader('Content-Type', format.mimeType || 'application/octet-stream')

    if (format.contentLength) {
      res.setHeader('Content-Length', format.contentLength)
    }

    ytdl(url, { quality: itag, ...opts }).pipe(res)
  } catch (err) {
    console.error('Error en /api/download:', err.message)
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'No se pudo descargar el video.' }))
  }
}
