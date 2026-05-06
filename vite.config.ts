import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const fromFiles = loadEnv(mode, process.cwd(), '')
  const backendOrigin = (
    fromFiles.VITE_API_BASE_URL ||
    fromFiles.API_BASE_URL ||
    process.env.VITE_API_BASE_URL ||
    process.env.API_BASE_URL ||
    ''
  )
    .toString()
    .replace(/\/$/, '')

  return {
    define: {
      __BACKEND_ORIGIN__: JSON.stringify(backendOrigin),
    },
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:8000',
          changeOrigin: true,
        },
      },
    },
  }
})
