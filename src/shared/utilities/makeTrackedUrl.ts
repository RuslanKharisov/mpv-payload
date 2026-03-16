import { getServerSideURL } from '@/shared/utilities/getURL'

export function makeTrackedUrl(opts: {
  website: string
  companyId?: string | null
  tenantId?: number | null
  src?: 'web' | 'ai' | 'telegram' | 'email'
  ctx?: string | null
  query?: string | null
}) {
  const baseUrl = getServerSideURL()
  const {
    website,
    companyId = null,
    tenantId = null,
    src = 'web',
    ctx = 'catalog',
    query = null,
  } = opts

  const normalizedWebsite = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(website)
    ? website
    : `https://${website}`
  const encodedUrl = Buffer.from(normalizedWebsite).toString('base64url')

  const params = new URLSearchParams({
    u: encodedUrl,
    src,
  })

  if (companyId) params.set('cid', companyId)
  if (tenantId != null) params.set('tid', String(tenantId))
  if (ctx) params.set('ctx', ctx)
  if (query) params.set('q', Buffer.from(query).toString('base64url'))

  return `${baseUrl}/api/track-redirect?${params.toString()}`
}
