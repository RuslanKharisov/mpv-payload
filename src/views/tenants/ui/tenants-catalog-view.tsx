'use client'

import { CompanyTag, Tenant } from '@/payload-types'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card'
import { Typography } from '@/shared/ui/typography'
import { CompanyFiltersSidebar } from '@/widgets/company-filters-sidebar'
import { ListPagination } from '@/widgets/pagination'
import { Building2, ExternalLink } from 'lucide-react'
import Link from 'next/link'

type TenantsCatalogViewProps = {
  tenants: Tenant[]
  pagination: {
    page: number
    totalPages: number
  }
  countries: string[]
  tags: CompanyTag[]
  totalDocs: number
}

export function TenantsCatalogView({
  tenants,
  pagination,
  countries,
  tags,
  totalDocs,
}: TenantsCatalogViewProps) {
  const pageTitle = 'Каталог компаний-поставщиков'

  // разделяем: со складом / без склада
  const tenantsWithWarehouse = tenants.filter((t) => t.warehouse)
  const tenantsWithoutWarehouse = tenants.filter((t) => !t.warehouse)

  const orderedTenants = [...tenantsWithWarehouse, ...tenantsWithoutWarehouse]

  return (
    <div className="py-3 lg:py-16">
      <div className="container">
        <div className="flex flex-col md:flex-row gap-5 lg:gap-12">
          <CompanyFiltersSidebar pageTitle={pageTitle} countries={countries} tags={tags} />

          <main className="flex flex-1 flex-col gap-5">
            <div className="prose dark:prose-invert max-w-none">
              <h1>{pageTitle}</h1>

              <Typography tag="p">Найдено компаний: {totalDocs}</Typography>
            </div>

            {tenants.length === 0 ? (
              ''
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {orderedTenants.map((tenant) => (
                  <Card key={tenant.id} className="flex flex-col">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                        <CardTitle className="text-lg">{tenant.name}</CardTitle>
                      </div>
                      {tenant.country && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {tenant.country}
                          {tenant.is_foreign ? ' · иностранная компания' : ''}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="text-sm text-muted-foreground line-clamp-4">
                        {tenant.description || 'Поставщик промышленного оборудования и услуг.'}
                      </p>
                      {Array.isArray(tenant.tags) && tenant.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {tenant.tags.slice(0, 3).map((tag: any) => (
                            <span
                              key={tag.id ?? tag}
                              className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                            >
                              {typeof tag === 'object' && tag.name ? tag.name : ''}
                            </span>
                          ))}
                          {tenant.tags.length > 3 && (
                            <span className="text-[11px] text-muted-foreground">
                              +{tenant.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      {tenant.slug && (
                        <Button asChild className="flex-1" variant="outline">
                          <Link href={`/supplier/${tenant.slug}`}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Профиль компании
                          </Link>
                        </Button>
                      )}
                      {tenant.warehouse && (
                        <Button asChild className="flex-1">
                          <Link href={`/supplier/${tenant.slug}?tab=stock`}>Остатки</Link>
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}

            <ListPagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              route="suppliers"
            />
          </main>
        </div>
      </div>
    </div>
  )
}
