import { defineConfig } from 'vitest/config'
import { loadEnv, type Plugin } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

const getGithubPagesUrl = (repository?: string) => {
  if (!repository?.includes('/')) {
    return undefined
  }

  const [owner, repo] = repository.split('/')
  if (!owner || !repo) {
    return undefined
  }

  return `https://${owner}.github.io/${repo}`
}

const normalizeSiteUrl = (siteUrl?: string) =>
  (siteUrl?.trim() || 'http://localhost:5173').replace(/\/+$/, '')

const seoArtifactsPlugin = (siteUrl: string): Plugin => {
  const routes = ['/', '/family', '/couple', '/group']

  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${new URL(route, `${siteUrl}/`).toString()}</loc>
  </url>`,
  )
  .join('\n')}
</urlset>
`

  return {
    name: 'seo-artifacts',
    configureServer(server) {
      server.middlewares.use('/robots.txt', (_req, res) => {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.end(robotsTxt)
      })

      server.middlewares.use('/sitemap.xml', (_req, res) => {
        res.setHeader('Content-Type', 'application/xml; charset=utf-8')
        res.end(sitemapXml)
      })
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: robotsTxt,
      })
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: sitemapXml,
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = normalizeSiteUrl(
    env.VITE_SITE_URL ||
      process.env.URL ||
      process.env.DEPLOY_PRIME_URL ||
      process.env.CF_PAGES_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      process.env.GITHUB_PAGES_URL ||
      getGithubPagesUrl(process.env.GITHUB_REPOSITORY),
  )

  return {
    plugins: [
      // The React and Tailwind plugins are both required for Make, even if
      // Tailwind is not being actively used – do not remove them
      react(),
      tailwindcss(),
      seoArtifactsPlugin(siteUrl),
    ],
    resolve: {
      alias: {
        // Alias @ to the src directory
        '@': path.resolve(__dirname, './src'),
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './src/test/setup.ts',
    },
  }
})
