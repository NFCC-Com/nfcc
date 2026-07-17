import { defineConfig } from 'vitest/config'

// Standalone test config — deliberately does NOT load the TanStack Start / Nitro
// vite plugins, which transform modules in ways that break plain unit tests.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
