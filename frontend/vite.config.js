import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Disable compiler in tests to speed up CI
      babel: process.env.VITEST ? undefined : {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    css: false,
    pool: 'threads',
    maxWorkers: 1,
    minWorkers: 1,
    testTimeout: 60000,
  },
})
