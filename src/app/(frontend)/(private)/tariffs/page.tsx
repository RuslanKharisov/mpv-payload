import { cn } from '@/shared/utilities/ui'
import { CheckIcon } from 'lucide-react'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import { Typography } from '@/shared/ui/typography'

async function page() {
  const payload = await getPayload({ config: configPromise })

  const tariffs = await payload.find({
    collection: 'tariffs',
  })

  return (
    <div className="relative isolate px-6 py-3 lg:py-16 lg:px-8 ">
      <div className="mx-auto max-w-4xl text-center">
        <Typography tag="h1">Цены</Typography>
        <Typography tag="p">Выберите подходящий тариф</Typography>
      </div>
      <Typography tag="p" className="mx-auto mt-6 max-w-2xl text-center opacity-80">
        Выберите доступный тариф с лучшими функциями для взаимодействия с аудиторией, повышения
        лояльности клиентов и стимулирования продаж.
      </Typography>
      <div className="mx-auto mt-16 grid grid-cols-1  gap-y-6 sm:mt-20 sm:gap-y-0 lg:grid-cols-3 gap-3">
        {tariffs.docs.map((tariff, idx) => (
          <div
            key={tariff.id}
            className={cn(
              idx % 2 !== 0
                ? 'relative bg-card shadow-2xl dark:shadow-none'
                : 'bg-background/60 sm:mx-8 lg:mx-0 dark:bg-background/2.5',
              'flex flex-col p-8 ring-1 ring-border sm:p-10 dark:ring-border',
            )}
          >
            <h3
              className={cn(
                idx % 2 !== 0 ? 'text-primary' : 'text-primary dark:text-primary',
                'text-base/7 font-semibold',
              )}
            >
              {tariff.name}
            </h3>
            <p className="mt-4 flex items-baseline gap-x-2">
              <span
                className={cn(
                  idx % 2 !== 0 ? 'text-foreground' : 'text-foreground dark:text-foreground',
                  'text-5xl font-semibold tracking-tight',
                )}
              >
                {tariff.price}
              </span>
              <span
                className={cn(
                  idx % 2 !== 0
                    ? 'text-muted-foreground'
                    : 'text-muted-foreground dark:text-muted-foreground',
                  'text-base',
                )}
              >
                /month
              </span>
            </p>
            <p
              className={cn(
                idx % 2 !== 0
                  ? 'text-muted-foreground'
                  : 'text-muted-foreground dark:text-muted-foreground',
                'mt-6 text-base/7',
              )}
            >
              {tariff.description}
            </p>
            <ul
              role="list"
              className={cn(
                idx % 2 !== 0
                  ? 'text-muted-foreground'
                  : 'text-muted-foreground dark:text-muted-foreground',
                'mt-8 space-y-3 text-sm/6 sm:mt-10 grow',
              )}
            >
              {tariff.benefits?.map((benefit) => (
                <li key={benefit.id} className="flex gap-x-3">
                  <CheckIcon
                    aria-hidden="true"
                    className={cn(
                      idx % 2 !== 0 ? 'text-primary' : 'text-primary dark:text-primary',
                      'h-6 w-5 flex-none',
                    )}
                  />
                  {benefit.value}
                </li>
              ))}
            </ul>
            <Link
              href={tariff.name}
              className={cn(
                idx % 2 !== 0
                  ? 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline-primary dark:shadow-none'
                  : 'text-primary ring-1 ring-inset ring-border hover:ring-border/80 focus-visible:outline-primary dark:bg-secondary dark:text-secondary-foreground dark:ring-border dark:hover:bg-secondary/80 dark:hover:ring-border dark:focus-visible:outline-secondary',
                'mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-offset-2 sm:mt-10',
              )}
            >
              Get started today
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default page
