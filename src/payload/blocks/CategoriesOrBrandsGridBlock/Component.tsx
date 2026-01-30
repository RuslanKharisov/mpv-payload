import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { ProductCategory, Brand } from '@/payload-types'
import { Card } from '@/components/ui/card'

import { ChevronRight } from 'lucide-react'
import { Typography } from '@/shared/ui/typography'
import { Button } from '@/shared/ui/button'
import Link from 'next/link'
import type { CategoriesOrBrandsGridBlock as BlockType } from '@/payload-types'
import { string } from 'zod'

interface GridItem {
  title: string
  description: string
  link: string
  id: string | number
}

const GridItemCard: React.FC<{ item: GridItem }> = ({ item }) => {
  return (
    <Card className="p-3 md:p-6 transition-all hover:shadow-md flex flex-col h-full">
      <div className="flex flex-col flex-1">
        <div className="space-y-2 py-4 flex-1">
          <Typography tag="h3" variant="inter-md-16" className="line-clamp-2 min-h-[2.5rem]">
            {item.title}
          </Typography>
          {item.description && (
            <Typography
              tag="p"
              variant="inter-reg-14"
              className="text-muted-foreground line-clamp-3 min-h-[3.75rem]"
            >
              {item.description}
            </Typography>
          )}
        </div>

        <div className="pt-4 mt-auto border-t border-dashed">
          <Button
            asChild
            variant="secondary"
            className="group w-full justify-between shadow-none hover:shadow-sm transition-shadow"
          >
            <Link href={item.link}>
              <span>Подробнее</span>
              <ChevronRight className="size-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}

export const CategoriesOrBrandsGridBlock: React.FC<BlockType> = async ({
  title,
  mode,
  manualItems,
  collection,
  limit = 9,
  columns = '3',
}) => {
  let items: GridItem[] = []

  try {
    if (mode === 'manual') {
      items =
        manualItems?.map((item, index) => ({
          id: `manual-${index}`,
          title: item.title || 'Без названия',
          description: item.description || '',
          link: item.link?.startsWith('/') ? item.link : `/${item.link}`,
        })) || []
    } else if (mode === 'fromCollection' && collection) {
      const payload = await getPayload({ config: configPromise })

      const result = await payload.find({
        collection: collection as 'product-categories' | 'brands',
        where: {
          isPromoted: {
            equals: true,
          },
        },
        limit: Math.min(Number(limit), 20),
        depth: 1,
        sort: 'title',
      })

      if (collection === 'product-categories') {
        items = (result.docs as ProductCategory[])
          .filter((doc) => doc.slug && doc.title)
          .map((doc) => ({
            id: doc.id,
            title: doc.title,
            description: doc.description || '',
            link: `/products?category=${encodeURIComponent(doc.slug as string)}`,
          }))
      } else if (collection === 'brands') {
        items = (result.docs as Brand[])
          .filter((doc) => doc.slug && doc.name)
          .map((doc) => {
            // Безопасное получение описания (поле может отсутствовать в типе)
            const description = (doc as any).description || (doc as any).bio || ''
            return {
              id: doc.id,
              title: doc.name,
              description: typeof description === 'string' ? description : '',
              link: `/products?brands=${encodeURIComponent(doc.slug as string)}`,
            }
          })
      }
    }
  } catch (error) {
    console.error('Ошибка загрузки данных для сетки категорий/брендов:', error)
    items = []
  }

  if (items.length === 0) return null

  // Динамические классы сетки на основе настроек
  const columnsValue = String(columns || '3')
  const gridClasses =
    {
      '2': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2',
      '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      '4': 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-4',
    }[columnsValue] || 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'

  return (
    <section className="py-8 md:py-16">
      <div className="container">
        {title && (
          <Typography
            tag="h2"
            variant="inter-bold-36"
            className="mb-10 text-center max-w-3xl mx-auto"
          >
            {title}
          </Typography>
        )}

        <div className={`grid gap-4 md:gap-6 ${gridClasses}`}>
          {items.map((item) => (
            <GridItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
