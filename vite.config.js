import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  return {
    plugins: [react()],
    base: command === 'build' ? '/smashgg.io/' : '/',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})