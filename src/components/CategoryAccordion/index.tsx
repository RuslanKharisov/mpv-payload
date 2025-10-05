'use client'

import * as React from 'react'
import Link from 'next/link'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { ProductCategory } from '@/payload-types'

interface CategoryAccordionProps {
  categories: ProductCategory[]
}

export function CategoryAccordion({ categories }: CategoryAccordionProps) {
  const categoriesByParent: Record<string, ProductCategory[]> = {}
  const parentCategories: ProductCategory[] = []

  categories.forEach((category) => {
    if (!category.parent) {
      parentCategories.push(category)
    } else if (typeof category.parent === 'object' && category.parent.id) {
      const parentId = category.parent.id.toString()
      if (!categoriesByParent[parentId]) {
        categoriesByParent[parentId] = []
      }
      categoriesByParent[parentId].push(category)
    }
  })

  const defaultExpandedValues = parentCategories
    .filter((p) => categoriesByParent[p.id.toString()]?.length > 0)
    .map((p) => p.id.toString())

  return (
    <div className="columns-[300px] gap-x-4 gap-y-[10px]">
      {parentCategories.map((parent) => {
        const childCategories = categoriesByParent[parent.id.toString()] || []
        const hasChildren = childCategories.length > 0

        return (
          <div key={parent.id} className="mb-[10px] break-inside-avoid-column">
            {hasChildren ? (
              <Accordion type="multiple" defaultValue={defaultExpandedValues} className="w-full">
                <AccordionItem
                  value={parent.id.toString()}
                  className="overflow-hidden rounded-lg border bg-secondary"
                >
                  <AccordionTrigger className="p-4 text-base font-semibold hover:no-underline">
                    <Link href={`/products?category=${parent.slug}`} className="hover:underline">
                      {parent.title}
                    </Link>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <ul className="flex flex-col gap-2 pl-2">
                      {childCategories.map((child) => (
                        <li key={child.id} className="flex items-center gap-2">
                          <Link
                            href={`/products?category=${child.slug}`}
                            className="rounded px-1 text-sm  hover:bg-primary/90 hover:text-white duration-100"
                          >
                            {child.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ) : (
              <div className="flex min-h-[54px] items-center overflow-hidden rounded-lg border bg-secondary p-4">
                {parent.slug && (
                  <Link
                    href={`/products?category=${encodeURIComponent(parent.slug)}`}
                    className="w-full text-base font-semibold leading-[22px]"
                  >
                    {parent.title}
                  </Link>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
