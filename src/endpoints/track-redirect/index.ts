import type { Endpoint, PayloadRequest } from 'payload'
import { extractHostname } from '@/shared/utilities/normalizeUrl'

function decodeBase64Url(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/')
  const pad = str.length % 4
  if (pad) str += '='.repeat(4 - pad)
  return Buffer.from(str, 'base64').toString('utf8')
}

async function getTenantHostname(
  req: PayloadRequest,
  tenantId: number | null,
): Promise<string | null> {
  if (!tenantId) return null

  try {
    const tenant = await req.payload.findByID({
      collection: 'tenants',
      id: tenantId,
      depth: 0,
    })

    const domain = tenant?.domain
    if (!domain || typeof domain !== 'string' || !domain.trim()) return null

    return extractHostname(domain)
  } catch (e) {
    console.error('Failed to load tenant for redirect validation', e)
    return null
  }
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
    const tenantIdParam = url.searchParams.get('tid') || ''
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

    const srcValues = ['web', 'ai', 'telegram', 'email'] as const
    type Src = (typeof srcValues)[number]
    const src: Src = srcValues.includes(rawSrc as Src) ? (rawSrc as Src) : 'web'

    let tenant: number | null = null
    if (tenantIdParam) {
      const parsed = parseInt(tenantIdParam, 10)
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

    // Протокол: только http/https
    if (target.protocol !== 'https:' && target.protocol !== 'http:') {
      return new Response('Bad target URL protocol', { status: 400 })
    }

    // Проверка, что домен не подменён:
    const tenantHostname = await getTenantHostname(req, tenant)
    if (!tenantHostname) {
      return new Response('Invalid tenant for redirect', { status: 400 })
    }

    const targetHost = target.hostname.toLowerCase()
    if (targetHost !== tenantHostname) {
      // Здесь речь не про доступ, а про некорректный/подменённый URL
      return new Response('Invalid redirect target for tenant', { status: 400 })
    }

    // UTM-метки
    target.searchParams.set('utm_source', 'promstock')
    target.searchParams.set('utm_medium', src)
    if (ctx) target.searchParams.set('utm_campaign', ctx)
    if (!ctx) target.searchParams.set('utm_campaign', 'neftegaz-2026')
    if (companyId) target.searchParams.set('utm_content', companyId)

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
