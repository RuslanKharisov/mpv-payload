import React from 'react'
import type { FeaturesBlock as Props, Icon as IconType } from '@/payload-types'
import { ImageMedia } from '@/components/Media/ImageMedia'

const FutureItem: React.FC<{
  title: string
  text: string
  icon: number | IconType | null | undefined
}> = ({ title, text, icon }) => {
  const isObject = icon && typeof icon === 'object'
  return (
    <div>
      <div className="dark:bg-primary-900 mb-4 p-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary lg:h-12 lg:w-12">
        {isObject ? (
          <ImageMedia
            resource={icon}
            alt=""
            imgClassName="w-full h-full object-contain"
            pictureClassName="w-full h-full"
          />
        ) : (
          <div className="w-5 h-5 bg-white/30 rounded-full" />
        )}
      </div>
      <h3 className="mb-2 text-xl font-bold dark:text-white">{title}</h3>
      <p className="md:text-lg">{text}</p>
    </div>
  )
}

export const FeaturesBlock: React.FC<Props> = ({ title, description, items }) => {
  if (!items?.length) return null
  return (
    <section className="py-3">
      <div className="container lg:px-6">
        <div className="mb-8 max-w-screen-md lg:mb-16">
          <h2 className="mb-4 text-xl font-extrabold tracking-tight lg:text-4xl">{title}</h2>
          <p className="md:text-lg">{description}</p>
        </div>
        <div className="space-y-8 md:grid md:grid-cols-2 md:gap-12 md:space-y-0 lg:grid-cols-3">
          {items.map((item, i) => (
            <FutureItem
              key={item.id ?? `${item.title}-${i}`}
              title={item.title}
              text={item.text}
              icon={item.icon}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
