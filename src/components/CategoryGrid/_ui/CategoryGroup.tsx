'use client'

import { ProductCategory } from '@/payload-types'
import { useState } from 'react'

const CategoryGroup = ({
  parentCategory,
  childCategories,
}: {
  parentCategory: ProductCategory
  childCategories: ProductCategory[]
}) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const hasChildren = childCategories.length > 0

  return (
    <div
      className={`flex break-inside-avoid-column flex-col overflow-hidden rounded bg-gray-100 transition-all [&:not(:first-child)]:mt-[10px]`}
      style={{ maxHeight: isExpanded ? '2000px' : '54px' }}
    >
      <div className="flex items-center justify-between">
        <a
          className="block w-full rounded-lg p-4 text-base font-semibold leading-[22px] text-black hover:bg-gray-200"
          href={`/category/${parentCategory.slug}`}
        >
          <div className="flex w-full items-center gap-1">{parentCategory.title}</div>
        </a>
        {hasChildren && (
          <button
            className="p-3 [&_svg]:fill-primary-default"
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
              transition: 'transform 0.2s',
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="20"
              fill="none"
              className="w-6"
            >
              <path
                d="M4.098 7.012a.75.75 0 0 1 1.057-.081l5.345 4.581 5.346-4.581a.75.75 0 1 1 .976 1.138l-5.834 5a.75.75 0 0 1-.976 0l-5.833-5a.75.75 0 0 1-.081-1.057"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        )}
      </div>
      {hasChildren && (
        <ul className="flex flex-col gap-2 px-4 pb-4">
          {childCategories.map((child) => (
            <li key={child.id} className="flex flex-col items-start justify-center gap-1">
              <div className="flex w-full items-center gap-2 px-2">
                <div className="size-1.5 rounded-full bg-primary-default"></div>
                <a
                  className="w-fit rounded-lg px-1 text-sm font-normal text-black hover:bg-gray-200"
                  href={`/category/${child.slug}`}
                >
                  {child.title}
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export { CategoryGroup }
