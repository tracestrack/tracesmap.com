import react from '@vitejs/plugin-react'
import ssl from '@vitejs/plugin-basic-ssl'
import { defineConfig } from 'vite'

export default defineConfig(() => {
  return {
    plugins: [react(), ssl()],
  }
})
