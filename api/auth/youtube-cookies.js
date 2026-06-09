const BASE_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'

function parseSetCookie(raw) {
  const [nv] = raw.split(';')
  const idx = nv.indexOf('=')
  if (idx === -1) return null
  return { name: nv.substring(0, idx), value: nv.substring(idx + 1), domain: '.youtube.com' }
}

async function fetchWithCookies(url, options) {
  const response = await fetch(url, options)
  const cookies = []
  if (typeof response.headers.getSetCookie === 'function') {
    for (const c of response.headers.getSetCookie()) {
      const parsed = parseSetCookie(c)
      if (parsed) cookies.push(parsed)
    }
  } else {
    response.headers.forEach((value, name) => {
      if (name.toLowerCase() === 'set-cookie') {
        const parsed = parseSetCookie(value)
        if (parsed) cookies.push(parsed)
      }
    })
  }
  return { response, cookies }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Authorization')

  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
    return
  }

  const authHeader = req.headers['authorization']
  if (!authHeader) {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Falta token' }))
    return
  }

  try {
    const allCookies = []
    const seen = new Set()
    const apiHeaders = {
      'Authorization': authHeader,
      'User-Agent': BASE_UA,
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'Accept-Language': 'en-US,en;q=0.5',
      'X-YouTube-Client-Name': '1',
      'X-YouTube-Client-Version': '2.20250101.00.00',
      'Origin': 'https://www.youtube.com',
    }

    // 1. Llamar a la API interna de YouTube (player) con el Bearer token
    const body = {
      context: {
        client: {
          clientName: 'WEB',
          clientVersion: '2.20250101.00.00',
          hl: 'en',
          gl: 'US',
          utcOffsetMinutes: 0,
        },
      },
    }

    const { response: apiRes, cookies: apiCookies } = await fetchWithCookies(
      'https://www.youtube.com/youtubei/v1/player?videoId=dQw4w9WgXcQ',
      {
        method: 'POST',
        headers: apiHeaders,
        body: JSON.stringify(body),
      }
    )

    for (const c of apiCookies) {
      if (!seen.has(c.name)) { seen.add(c.name); allCookies.push(c) }
    }

    // 2. También intentar la página principal
    const { cookies: homeCookies } = await fetchWithCookies(
      'https://www.youtube.com',
      {
        headers: {
          'Authorization': authHeader,
          'User-Agent': BASE_UA,
          'Accept': 'text/html,*/*',
        },
      }
    )

    for (const c of homeCookies) {
      if (!seen.has(c.name)) { seen.add(c.name); allCookies.push(c) }
    }

    // 3. También probar accounts.google.com para cookies de autenticación
    const { cookies: accountCookies } = await fetchWithCookies(
      'https://accounts.google.com/AccountChooser?service=youtube&continue=https://www.youtube.com',
      {
        headers: {
          'Authorization': authHeader,
          'User-Agent': BASE_UA,
        },
      }
    )

    for (const c of accountCookies) {
      if (!seen.has(c.name)) { seen.add(c.name); allCookies.push(c) }
    }

    const apiStatus = apiRes.status
    const hasSapisid = allCookies.some(c => c.name === 'SAPISID' || c.name === '__Secure-3PAPISID')

    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({
      cookies: allCookies,
      count: allCookies.length,
      apiStatus,
      hasSapisid,
      message: hasSapisid
        ? 'Cookies de YouTube obtenidas correctamente'
        : 'No se pudieron obtener cookies de autenticación. Necesitás usar el botón de marcadores.',
    }))
  } catch (err) {
    console.error('Error:', err.message)
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: err.message }))
  }
}
