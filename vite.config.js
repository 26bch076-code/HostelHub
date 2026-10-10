import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { aiProxyMiddleware } from './server/aiProxy.js'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables from .env on the server side
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      {
        name: 'gemma-ai-backend-proxy',
        configureServer(server) {
          server.middlewares.use(aiProxyMiddleware(env))
        }
      }
    ],
    server: {
      port: 5173,
      open: false
    }
  }
})
