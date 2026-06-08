import http from 'http'
import infoHandler from './info.js'
import downloadHandler from './download.js'

const PORT = 3001

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`)

  req.query = Object.fromEntries(parsedUrl.searchParams)

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Range')

  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
    return
  }

  try {
    if (parsedUrl.pathname === '/api/info' && req.method === 'GET') {
      await infoHandler(req, res)
    } else if (parsedUrl.pathname === '/api/download' && req.method === 'GET') {
      await downloadHandler(req, res)
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Ruta no encontrada' }))
    }
  } catch (err) {
    console.error('Server error:', err)
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Error interno del servidor' }))
  }
})

server.listen(PORT, () => {
  console.log(`[ybdn] API server running at http://localhost:${PORT}`)
})
