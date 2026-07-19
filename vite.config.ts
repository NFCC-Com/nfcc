import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    nitro({
      rollupConfig: { external: [/^@sentry\//] },
      cloudflare: {
        wrangler: {
          name: 'nfcc',
          observability: {
            enabled: true,
            logs: { enabled: true, invocation_logs: true },
          },
          hyperdrive: [
            {
              binding: 'HYPERDRIVE',
              id: process.env.CF_HYPERDRIVE_ID || 'efb618f46eea4593b6edf30b8cc2e0e0',
              localConnectionString: process.env.DATABASE_URL,
            },
          ],
        },
      },
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
