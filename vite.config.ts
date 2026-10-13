import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  envPrefix: ['SERVER_URL', 'LOBBY_SOCKET_URL', 'MATCH_SOCKET_URL'],
  plugins: [react()],
})
