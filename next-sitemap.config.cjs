const SITE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  'https://example.com'

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  exclude: [
    '/posts-sitemap.xml',
    '/pages-sitemap.xml',
    '/admin/*',
    '/posts/*',
    '/stock?*',
    '/search',
    '/login',
    '/register',
    '/verify',
  ],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', disallow: '/admin/*' },
      { userAgent: '*', disallow: '/stock?*' },
      { userAgent: '*', disallow: '/search' },
      { userAgent: '*', disallow: '/login' },
      { userAgent: '*', disallow: '/register' },
      { userAgent: '*', disallow: '/verify' },
    ],
    additionalSitemaps: [`${SITE_URL}/pages-sitemap.xml`, `${SITE_URL}/posts-sitemap.xml`],
  },
}
