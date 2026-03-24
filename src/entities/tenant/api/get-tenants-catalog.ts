'use server'

import configPromise from '@payload-config'
import { getPayload, Where } from 'payload'
import { Tenant, CompanyTag } from '@/payload-types'
import { unstable_cache } from 'next/cache'

// 1. Добавляем недостающие интерфейсы
type Params = {
  page?: string
  country?: string
  phrase?: string
  tagSlugs?: string
  hasStock?: string
}

type TenantsCatalogResponse = {
  tenants: Tenant[]
  pagination: {
    page: number
    totalPages: number
  }
  totalDocs: number
  countries: string[]
  tags: CompanyTag[]
}

// 2. Кэширование стран с типизацией
const getCachedCountries = unstable_cache(
  async () => {
    // 2. Получаем payload прямо здесь
    const payload = await getPayload({ config: configPromise })

    const allTenants = await payload.find({
      collection: 'tenants',
      where: { allowPublicRead: { equals: true } },
      depth: 0,
      limit: 1000,
      select: { country: true },
      pagination: false,
    })

    const rawCountries = allTenants.docs
      .map((t: any) => t.country)
      .filter((c: unknown): c is string => typeof c === 'string' && c.trim().length > 0)

    const uniqueCountries = Array.from(new Set(rawCountries))

    return uniqueCountries.sort((a: string, b: string) => a.localeCompare(b, 'ru'))
  },
  ['tenants-countries-list'],
  { revalidate: 3600, tags: ['tenants'] },
)

export async function getTenantsCatalog({
  page,
  country,
  phrase,
  tagSlugs,
  hasStock,
}: Params): Promise<TenantsCatalogResponse> {
  const payload = await getPayload({ config: configPromise })
  const pageNumber = Number(page) || 1
  const limit = 24

  const where: Where = {
    allowPublicRead: { equals: true },
  }

  if (country) where.country = { equals: country }

  if (phrase) {
    where.or = [{ name: { contains: phrase } }, { description: { contains: phrase } }]
  }

  if (tagSlugs) {
    const selectedTagSlugs = tagSlugs
      .split(',')
      .map((s: string) => s.trim()) // Типизируем 's'
      .filter(Boolean)

    if (selectedTagSlugs.length > 0) {
      where['tags.slug'] = { in: selectedTagSlugs }
    }
  }

  // Используем наше новое быстрое поле
  if (hasStock === '1') where.hasActiveStock = { equals: true }
  if (hasStock === '0') where.hasActiveStock = { equals: false }

  const tenantsReq = await payload.find({
    collection: 'tenants',
    where,
    page: pageNumber,
    limit,
    depth: 1,
    sort: 'name',
    select: {
      name: true,
      slug: true,
      description: true,
      country: true,
      tags: true,
      hasActiveStock: true,
    },
  })

  const countries = await getCachedCountries()

  const tagsReq = await payload.find({
    collection: 'company-tags',
    limit: 100,
    pagination: false,
    sort: 'name',
  })

  return {
    tenants: tenantsReq.docs as Tenant[],
    pagination: {
      page: tenantsReq.page ?? 1,
      totalPages: tenantsReq.totalPages,
    },
    totalDocs: tenantsReq.totalDocs,
    countries,
    tags: tagsReq.docs as CompanyTag[],
  }
}
