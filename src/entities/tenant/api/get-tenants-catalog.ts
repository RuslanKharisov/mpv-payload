// src/entities/tenant/api/get-tenants-catalog.ts
'use server'

import configPromise from '@payload-config'
import { getPayload, Where } from 'payload'
import { Tenant, CompanyTag, Warehouse, Stock } from '@/payload-types'

type Params = {
  page?: string
  country?: string
  phrase?: string
  tagSlugs?: string // "tag1,tag2"
  hasStock?: string // "1" | "0"
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

  // фильтр по стране
  if (country) {
    where.country = { equals: country }
  }

  // поиск по фразе (название + описание)
  if (phrase) {
    where.or = [{ name: { contains: phrase } }, { description: { contains: phrase } }]
  }

  // фильтр по тегам (company-tags)
  let selectedTagSlugs: string[] = []
  if (tagSlugs) {
    selectedTagSlugs = tagSlugs
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    if (selectedTagSlugs.length > 0) {
      // фильтр по slug'ам связанных тегов
      where['tags.slug'] = { in: selectedTagSlugs }
    }
  }

  // фильтр "есть склад" — через stocks, как у продуктов
  if (hasStock === '1' || hasStock === '0') {
    // ищем все stocks, у которых есть связанный tenant
    const stocks = await payload.find({
      collection: 'stocks',
      where: {
        tenant: { exists: true },
      },
      depth: 0,
      limit: 1000, // 0 = нет лимита по страницам, но docs пустые; лучше задать разумный лимит
      pagination: false,
    })

    const tenantIdsWithStock = (stocks.docs as Stock[])
      .map((s) => {
        const tenantField = s.tenant
        if (!tenantField) return null

        if (typeof tenantField === 'object') {
          return tenantField.id ?? null
        }

        return tenantField
      })
      .filter((id): id is number => typeof id === 'number')

    if (hasStock === '1') {
      if (tenantIdsWithStock.length > 0) {
        where.id = { in: tenantIdsWithStock }
      } else {
        where.id = { in: [-1] } // заглушка, чтобы ничего не вернуть
      }
    }

    if (hasStock === '0') {
      if (tenantIdsWithStock.length > 0) {
        where.id = { not_in: tenantIdsWithStock }
      }
      // если tenantIdsWithStock пуст, условие не нужно — и так все без складов
    }
  }

  const tenantsReq = await payload.find({
    collection: 'tenants',
    where,
    page: pageNumber,
    limit,
    depth: 1,
    sort: 'name',
  })

  // справочники для сайдбара

  // 1) страны (distinct по Tenants)
  const allTenants = await payload.find({
    collection: 'tenants',
    where: {
      allowPublicRead: { equals: true },
    },
    depth: 0,
    pagination: false,
  })

  const countries = Array.from(
    new Set(
      allTenants.docs
        .map((t: any) => t.country as string | undefined)
        .filter((c): c is string => Boolean(c && c.trim().length > 0)),
    ),
  ).sort((a, b) => a.localeCompare(b, 'ru'))

  // 2) теги
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
