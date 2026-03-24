import { getTenantBySlug } from '@/entities/tenant/api/get-tenant-by-slug'
import { GoogleStockPublic } from '@/widgets/public-stocks/google-stock-public'
import { LocalWarehousesPublic } from '@/widgets/public-stocks/local-warehouses-public'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { Building2, ExternalLink, Link as WebSiteLink, Mail, MapPin } from 'lucide-react'
import notFound from '../../../not-found'
import Link from 'next/link'
import { Button } from '@/shared/ui/button'
import type { Metadata } from 'next'
import { generateMeta } from '@/shared/utilities/generateMeta'
import { StockSearchBar } from '@/widgets/stock-search-bar'
import { Suspense } from 'react'
import { makeTrackedUrl } from '@/shared/utilities/makeTrackedUrl'
import { Badge } from '@/shared/ui/badge'
import { CompanyTag } from '@/payload-types'
import { ROUTES } from '@/shared/lib/routes'

type Args = {
  params: Promise<{ slug?: string }>
  searchParams: Promise<{ tab?: string; sku?: string; description?: string }>
}

export default async function Page({ params: paramsPromise, searchParams }: Args) {
  const { slug = '' } = await paramsPromise
  const { tab = 'google', sku = '', description = '' } = await searchParams

  const supplier = await getTenantBySlug(slug)
  if (!supplier) {
    return notFound()
  }

  const hasGoogleApi = supplier.apiUrl && supplier.apiUrl.trim().length > 0

  const website = supplier.domain?.trim()
  const trackedWebsite = website
    ? makeTrackedUrl({
        website,
        tenantId: supplier.id,
        src: 'web',
        ctx: 'catalog',
      })
    : null

  const email = supplier.requestEmail?.trim()
  const country = supplier.country?.trim()
  const address = supplier.address?.trim()

  const visibleTags = Array.isArray(supplier.tags)
    ? supplier.tags.filter((t): t is CompanyTag => t !== null && typeof t === 'object').slice(0, 6)
    : []

  return (
    <div className="py-8 lg:py-12">
      <div className="container flex flex-col gap-8">
        {/* Шапка */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="h-5 w-5" />
              <span className="text-sm">Поставщик</span>
              {supplier.isForeign && (
                <Badge variant="outline" className="text-xs">
                  Иностранная компания
                </Badge>
              )}
            </div>

            <h1 className="text-3xl font-bold">{supplier.name}</h1>

            {trackedWebsite && (
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <WebSiteLink strokeWidth={2.5} className="h-4 w-4" />
                <a
                  href={trackedWebsite}
                  className="font-medium text-primary hover:text-destructive/60 transition-colors duration-300 break-all"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {website}
                </a>
              </div>
            )}

            <div className="space-y-1 text-sm text-muted-foreground">
              {email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <a href={`mailto:${email}`} className="hover:underline">
                    {email}
                  </a>
                </div>
              )}

              {(country || address) && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5" />
                  <div className="space-y-0.5">
                    {country && <p>{country}</p>}
                    {address && <p>{address}</p>}
                  </div>
                </div>
              )}
            </div>

            {supplier.description && (
              <p className="text-sm text-muted-foreground max-w-2xl">{supplier.description}</p>
            )}

            {visibleTags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {visibleTags.map((tag) => (
                  <Badge key={tag.id} variant="secondary" className="text-[11px] font-normal">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Button asChild variant="outline">
            <Link href={ROUTES.SUPPLIERS}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Все компании
            </Link>
          </Button>
        </div>

        <Suspense>
          <StockSearchBar />
        </Suspense>

        {/* Табы */}
        <Tabs defaultValue={hasGoogleApi ? tab : 'local'} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="local">🏭 Локальные склады</TabsTrigger>
            <TabsTrigger value="google" disabled={!hasGoogleApi}>
              📊 Google Таблицы
            </TabsTrigger>
          </TabsList>

          <TabsContent value="local" className="mt-6">
            <LocalWarehousesPublic supplier={supplier} filters={{ sku, description }} />
          </TabsContent>

          <TabsContent value="google" className="mt-6">
            {hasGoogleApi ? (
              <GoogleStockPublic supplier={supplier} filters={{ sku, description }} />
            ) : (
              <div className="rounded-lg bg-gray-50 py-16 text-center dark:bg-gray-800">
                <p className="text-muted-foreground">
                  У этого поставщика нет подключения к Google Таблицам.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug = '' } = await params
  const supplier = await getTenantBySlug(slug)

  if (!supplier) {
    return generateMeta({ doc: { meta: { title: 'Поставщик не найден' } } })
  }

  return generateMeta({
    doc: {
      meta: {
        title: `${supplier.name} — Поставщик промышленного оборудования`,
        description:
          supplier.description ||
          supplier.meta?.description ||
          `Информация о поставщике ${supplier.name}`,
      },
    },
  })
}
