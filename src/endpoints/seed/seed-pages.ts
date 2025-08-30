import type { Payload, RequiredDataFromCollectionSlug } from 'payload'
import { Media } from '@/payload-types'

// 1. Импортируем данные для ВСЕХ страниц
import { home } from './data/home'
import { privacyPolicy } from './data/privacy-policy'
import { termsOfUse } from './data/terms-of-use'
import { userAgreement } from './data/user-agreement'
import { googleSheetsApiGuide } from './data/google-sheets-api-guide'
// import { aboutUs } from './data/about-us'

/**
 * **ИСПРАВЛЕНИЕ ЗДЕСЬ**
 * Мы создаем интерфейс для нашей конфигурации.
 * Ключевой момент: `dataFunction` принимает `media: any`.
 * Это позволяет нашему циклу вызывать функции с разными типами аргументов (HomeArgs, PolicyArgs и т.д.).
 * При этом сами функции (home, privacyPolicy) остаются строго типизированными!
 */
interface PageConfig {
  slug: string
  cliFlag: string
  dataFunction: (media: any) => RequiredDataFromCollectionSlug<'pages'>
  mediaDependencies: { [key: string]: string }
}

/**
 * Конфигурационный массив для всех страниц.
 * Теперь он типизирован с помощью `PageConfig`.
 */
const pagesToSeed: PageConfig[] = [
  {
    slug: 'home',
    cliFlag: '--home',
    dataFunction: home,
    mediaDependencies: { heroImage: 'homeHero', metaImage: 'homeHero' },
  },
  {
    slug: 'privacy-policy',
    cliFlag: '--policy',
    dataFunction: privacyPolicy,
    mediaDependencies: { heroImage: 'heroImage' },
  },
  {
    slug: 'terms-of-use',
    cliFlag: '--terms',
    dataFunction: termsOfUse,
    mediaDependencies: { heroImage: 'heroImage' }, // Предполагаем, что ей тоже нужно hero-изображение
  },
  {
    slug: 'user-agreement',
    cliFlag: '--agreement',
    dataFunction: userAgreement,
    mediaDependencies: { heroImage: 'heroImage' },
  },
  {
    slug: 'google-sheets-api-guide',
    cliFlag: '--guide',
    dataFunction: googleSheetsApiGuide,
    mediaDependencies: { heroImage: 'heroImage' },
  },
]

/**
 * Универсальная функция для заполнения всех страниц.
 */
export const seedPages = async (
  payload: Payload,
  media: { [key: string]: Media },
  args: string[],
): Promise<void> => {
  console.log('--- Заполнение статичных страниц ---')

  const pagesToProcess = pagesToSeed.filter((page) => args.includes(page.cliFlag))

  if (pagesToProcess.length === 0) {
    console.log('Нет страниц для заполнения. Пропускаем.')
    return
  }

  for (const page of pagesToProcess) {
    console.log(`-> Начинаем заполнение страницы: '${page.slug}'...`)

    // 1. ЦЕЛЕВАЯ ОЧИСТКА (без изменений)
    try {
      const existingPage = await payload.find({
        collection: 'pages',
        where: { slug: { equals: page.slug } },
        limit: 1,
      })

      if (existingPage.docs.length > 0) {
        await payload.delete({ collection: 'pages', id: existingPage.docs[0].id })
        console.log(`   ✓ Старая страница '${page.slug}' удалена.`)
      }
    } catch (error) {
      console.log(`   ! Ошибка при удалении страницы '${page.slug}': ${error}`)
    }

    // 2. ПОДГОТОВКА МЕДИА (без изменений)
    const requiredMedia: { [key: string]: Media } = {}
    for (const [key, mediaKey] of Object.entries(page.mediaDependencies)) {
      if (media[mediaKey]) {
        requiredMedia[key] = media[mediaKey]
      } else {
        console.log(`   ! Для страницы '${page.slug}' не найден медиафайл с ключом '${mediaKey}'`)
      }
    }

    // 3. СОЗДАНИЕ НОВОЙ СТРАНИЦЫ (теперь без ошибок)
    try {
      await payload.create({
        collection: 'pages',
        data: page.dataFunction(requiredMedia),
      })
      console.log(`   ✓ Новая страница '${page.slug}' успешно создана.`)
    } catch (error) {
      console.log(`   ! Ошибка при создании страницы '${page.slug}': ${error}`)
    }
  }

  console.log('--- Заполнение статичных страниц завершено ---')
}
