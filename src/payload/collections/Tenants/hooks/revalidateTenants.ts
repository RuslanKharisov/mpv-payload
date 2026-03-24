import { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

const triggerFullRevalidate = (slug?: string) => {
  try {
    // 1. Сбрасываем кэш данных (для фильтров и API)
    revalidateTag('tenants')

    // 2. Сбрасываем кэш страницы каталога
    revalidatePath('/tenants') // укажи путь к твоему каталогу компаний

    // 3. Если есть slug, сбрасываем кэш конкретной страницы компании
    if (slug) {
      revalidatePath(`/tenants/${slug}`)
    }

    console.log(`--- REVALIDATED: tenants tag and paths ---`)
  } catch (e) {
    // игнорируем вне Next.js
  }
}

export const revalidateTenantsAfterChange: CollectionAfterChangeHook = ({ doc, req }) => {
  // Проверяем контекст, чтобы не спамить ревалидацией при массовом импорте (seed)
  if (!req.context.disableRevalidate) {
    triggerFullRevalidate(doc?.slug)
  }
  return doc
}

export const revalidateTenantsAfterDelete: CollectionAfterDeleteHook = ({ doc, req }) => {
  if (!req.context.disableRevalidate) {
    triggerFullRevalidate(doc?.slug)
  }
  return doc
}
