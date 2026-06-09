import infoHandler from '../api/info.js'
import downloadHandler from '../api/download.js'
import youtubeCookiesHandler from '../api/auth/youtube-cookies.js'

export default function apiRoutes() {
  return {
    name: 'api-routes',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`)

        if (!url.pathname.startsWith('/api/')) {
          return next()
        }

        req.query = Object.fromEntries(url.searchParams)

        if (url.pathname === '/api/info' && req.method === 'GET') {
          await infoHandler(req, res)
        } else if (url.pathname === '/api/download' && req.method === 'GET') {
          await downloadHandler(req, res)
        } else if (url.pathname === '/api/auth/youtube-cookies' && req.method === 'GET') {
          await youtubeCookiesHandler(req, res)
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Not found' }))
        }
      })
    },
  }
}
