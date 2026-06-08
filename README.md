# ybdn

Descargá audio o video de YouTube desde tu navegador. Interfaz moderna, rápida y sin publicidad.

## Web App (Nuevo)

La nueva versión de **ybdn** es una aplicación web construida con **React + Vite + TailwindCSS**, desplegada en **Vercel**.

### ✨ Características

- Interfaz moderna y responsiva (dark mode)
- Buscá videos de YouTube por URL
- Elegí formato: solo audio o video+audio
- Descargá directo desde el navegador
- Historial de descargas (localStorage)
- 100% gratis, sin publicidad

### 🚀 Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/LuksFay/ybdn)

1. Forkeá el repo en GitHub
2. Conectalo a Vercel
3. ¡Listo! La app se despliega automáticamente

### 🛠 Stack

| Frontend | Backend (API) |
|----------|--------------|
| React 19 | Node.js (Vercel Serverless) |
| Vite 8   | `@distube/ytdl-core` |
| TailwindCSS 4 | |

### 📁 Estructura

```
ybdn/
├── api/
│   ├── info.js         # Obtiene info del video
│   └── download.js     # Stream de descarga
├── src/
│   ├── components/     # Componentes React
│   ├── utils/          # Utilidades (api.js)
│   └── App.jsx         # Componente principal
├── public/
├── index.html
├── package.json
├── vite.config.js
└── vercel.json
```

### 🏗 Desarrollo local

```bash
npm install
npm run dev
```

Las rutas `/api/*` se manejan automáticamente dentro del dev server de Vite (vía plugin). Abrí `http://localhost:5173`.

### 🐍 Versión Legacy (Python)

Si preferís la versión de terminal original, seguí usando `ybdn.py` con Python:

```bash
pip install pytubefix
python ybdn.py
```

El ejecutable `.exe` para Windows está en `ybdn/ybdn.exe`.

---

Hecho por [@LuksFayDev](https://x.com/LuksFaydev)
