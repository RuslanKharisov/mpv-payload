import type { Endpoint, PayloadRequest } from 'payload'

function decodeBase64Url(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/')
  const pad = str.length % 4
  if (pad) str += '='.repeat(4 - pad)
  return Buffer.from(str, 'base64').toString('utf8')
}

export const trackRedirectEndpoint: Endpoint = {
  path: '/track-redirect',
  method: 'get',
  handler: async (req: PayloadRequest): Promise<Response> => {
    if (!req.url) {
      return Response.json({ success: false, error: 'Invalid Url' }, { status: 401 })
    }

    const url = new URL(req.url)

    const encoded = url.searchParams.get('u')
    const rawSrc = url.searchParams.get('src')
    const companyId = url.searchParams.get('cid') || null
    const tenantId = url.searchParams.get('tid') || ''
    const ctx = url.searchParams.get('ctx') || null
    const rawQuery = url.searchParams.get('q')
    const query = (() => {
      if (!rawQuery) return null
      try {
        return decodeBase64Url(rawQuery)
      } catch {
        return null
      }
    })()

    if (!encoded) {
      return new Response('Missing "u" param', { status: 400 })
    }

    // src: строго из union
    const srcValues = ['web', 'ai', 'telegram', 'email'] as const
    type Src = (typeof srcValues)[number]
    const src: Src = srcValues.includes(rawSrc as Src) ? (rawSrc as Src) : 'web'

    // tenant: number | null (ID тенанта, не объект)
    let tenant: number | null = null
    if (tenantId) {
      const parsed = parseInt(tenantId, 10)
      if (!Number.isNaN(parsed)) {
        tenant = parsed
      }
    }

    let targetRaw: string
    try {
      targetRaw = decodeBase64Url(encoded)
    } catch {
      return new Response('Bad encoded URL', { status: 400 })
    }

    let target: URL
    try {
      target = new URL(targetRaw)
    } catch {
      return new Response('Bad target URL', { status: 400 })
    }

    // UTM-метки
    target.searchParams.set('utm_source', 'promstock')
    target.searchParams.set('utm_medium', src)
    if (ctx) target.searchParams.set('utm_campaign', ctx)
    if (!ctx) target.searchParams.set('utm_campaign', 'neftegaz-2026')
    if (companyId) target.searchParams.set('utm_content', companyId)

    // IP из заголовков (PayloadRequest без поля ip)
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || ''

    try {
      await req.payload.create({
        collection: 'clicks',
        data: {
          companyId,
          tenant,
          src,
          ctx,
          query,
          target: target.toString(),
          ip,
          userAgent: req.headers.get('user-agent') || '',
        },
        overrideAccess: true,
      })
    } catch (e) {
      console.error('Failed to log click', e)
    }

    return Response.redirect(target.toString(), 302)
  },
}
