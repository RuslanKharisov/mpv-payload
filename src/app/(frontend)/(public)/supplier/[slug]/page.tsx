import { getTenantBySlug } from '@/entities/tenant/api/get-tenant-by-slug'
import { GoogleStockPublic } from '@/widgets/public-stocks/google-stock-public'
import { LocalWarehousesPublic } from '@/widgets/public-stocks/local-warehouses-public'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { Building2, ExternalLink, Link as WebSiteLink } from 'lucide-react'
import notFound from '../../../not-found'
import Link from 'next/link'
import { Button } from '@/shared/ui/button'
import { Metadata } from 'next'
import { generateMeta } from '@/shared/utilities/generateMeta'
import { StockSearchBar } from '@/widgets/stock-search-bar'
import { Suspense } from 'react'
import { makeTrackedUrl } from '@/shared/utilities/makeTrackedUrl'

type Args = {
  params: Promise<{ slug?: string }>
  searchParams: Promise<{ tab?: string; sku?: string; description?: string }>
}

export default async function page({ params: paramsPromise, searchParams }: Args) {
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

  return (
    <div className="py-8 lg:py-12">
      <div className="container flex flex-col gap-8">
        {/* Шапка */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Building2 className="h-5 w-5" />
              <span className="text-sm">Поставщик</span>
            </div>
            <h1 className="text-3xl font-bold">{supplier.name}</h1>
            {trackedWebsite && (
              <div className="flex gap-3 items-center">
                <WebSiteLink strokeWidth={2.5} />
                <a
                  href={trackedWebsite}
                  className="text-3xl font-bold text-primary hover:text-destructive/50 transition-colors duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  nppgks.com
                </a>
              </div>
            )}
            {supplier.meta?.description && (
              <p className="text-muted-foreground mt-2 max-w-2xl">{supplier.meta.description}</p>
            )}
          </div>
          <Button asChild variant="outline">
            <Link href="/stock">
              <ExternalLink className="mr-2 h-4 w-4" />
              Все поставщики
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
        title: `${supplier.name} — Остатки на складе`,
        description: supplier.meta?.description || `Актуальные остатки ${supplier.name}`,
      },
    },
  })
}
