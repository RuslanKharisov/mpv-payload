import fs from 'node:fs/promises'
import path from 'node:path'
import type { Payload } from 'payload'
import { companyTagNameToSlug } from './company-tags-map'

type CompanyJson = {
  title: string
  description: string
  content: string
  metadata: {
    country?: string
    email?: string
    website?: string
    address?: string
    tags?: string[]
    is_foreign?: boolean
  }
}

export async function seedTenantsFromJson(payload: Payload) {
  const filePath = path.join(
    process.cwd(),
    'src',
    'endpoints',
    'seed',
    'data',
    'companies_rag_v2_tagged.json',
  )

  const raw = await fs.readFile(filePath, 'utf-8')
  const companies = JSON.parse(raw) as CompanyJson[]

  let processed = 0
  let skipped = 0

  // 1. Подтянем все теги company-tags разом
  const allTags = await payload.find({
    collection: 'company-tags',
    limit: 1000,
  })

  const slugToId = new Map<string, number>()
  for (const t of allTags.docs) {
    slugToId.set((t as any).slug, Number((t as any).id))
  }

  for (const company of companies) {
    const { title, description, metadata } = company

    const email = metadata.email?.trim()
    const website = metadata.website?.trim()

    if (
      !email ||
      !website ||
      email.toLowerCase() === 'не указан' ||
      website.toLowerCase() === 'не указан'
    ) {
      console.log(`⏭ Пропуск компании без контактов: ${title}`)
      skipped++
      continue
    }

    // 2. Собираем ids тегов для Tenants
    const tagNames = metadata.tags ?? []
    const tagIds: number[] = []

    for (const tagName of tagNames) {
      const slug = companyTagNameToSlug[tagName]
      if (!slug) {
        console.warn(`⚠️ Неизвестный тег в JSON: "${tagName}"`)
        continue
      }
      const id = slugToId.get(slug)
      if (!id) {
        console.warn(`⚠️ Тег не найден в company-tags по slug: "${slug}"`)
        continue
      }
      tagIds.push(id)
    }

    // 3. Ищем, есть ли уже Tenant с таким name + source=parsing
    const existing = await payload.find({
      collection: 'tenants',
      where: {
        and: [{ name: { equals: title } }, { source: { equals: 'parsing' } }],
      },
      limit: 1,
    })

    const data = {
      name: title,
      description,
      domain: website,
      requestEmail: email,
      country: metadata.country || '',
      address: metadata.address || '',
      is_foreign: metadata.is_foreign ?? false,
      source: 'parsing' as const,
      tags: tagIds,
      allowPublicRead: true,
    }

    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'tenants',
        id: existing.docs[0].id,
        data: {
          ...data,
          updatedAt: new Date().toISOString(),
        },
      })
      console.log(`✅ Tenant обновлён: ${title}`)
    } else {
      await payload.create({
        collection: 'tenants',
        data,
      })
      console.log(`➕ Tenant создан: ${title}`)
    }
    processed++
  }

  console.log(
    `🎉 Импорт Tenants из JSON завершён. Всего в файле: ${companies.length}, создано/обновлено: ${processed}, пропущено: ${skipped}`,
  )
}
