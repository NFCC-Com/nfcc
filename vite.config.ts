import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

const config = defineConfig({
  server: {
    allowedHosts: ["monit.tako.build"],
  },
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
              id: process.env.CF_HYPERDRIVE_ID || 'daca07a30b8841f6bee2ee0a5e758c21',
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
