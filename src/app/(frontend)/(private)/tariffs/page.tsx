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
        <Typography variant="inter-md-16" tag="h1">
          Цены
        </Typography>
        <Typography variant="inter-bold-48" tag="p">
          Выберите подходящий тариф
        </Typography>
      </div>
      <Typography
        variant="inter-md-24"
        tag="p"
        className="mx-auto mt-6 max-w-2xl text-center opacity-80"
      >
        Выберите доступный тариф с лучшими функциями для взаимодействия с аудиторией, повышения
        лояльности клиентов и стимулирования продаж.
      </Typography>
      <div className="mx-auto mt-16 grid grid-cols-1  gap-y-6 sm:mt-20 sm:gap-y-0 lg:grid-cols-3 gap-3">
        {tariffs.docs.map((tariff, idx) => (
          <div
            key={tariff.id}
            className={cn(
              idx % 2 !== 0
                ? 'relative bg-gray-900 shadow-2xl dark:bg-gray-800 dark:shadow-none'
                : 'bg-white/60 sm:mx-8 lg:mx-0 dark:bg-white/[0.025]',
              'flex flex-col p-8 ring-1 ring-gray-900/10 sm:p-10 dark:ring-white/10',
            )}
          >
            <h3
              className={cn(
                idx % 2 !== 0 ? 'text-indigo-400' : 'text-indigo-600 dark:text-indigo-400',
                'text-base/7 font-semibold',
              )}
            >
              {tariff.name}
            </h3>
            <p className="mt-4 flex items-baseline gap-x-2">
              <span
                className={cn(
                  idx % 2 !== 0 ? 'text-white' : 'text-gray-900 dark:text-white',
                  'text-5xl font-semibold tracking-tight',
                )}
              >
                {tariff.price}
              </span>
              <span
                className={cn(
                  idx % 2 !== 0 ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400',
                  'text-base',
                )}
              >
                /month
              </span>
            </p>
            <p
              className={cn(
                idx % 2 !== 0 ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300',
                'mt-6 text-base/7',
              )}
            >
              {tariff.description}
            </p>
            <ul
              role="list"
              className={cn(
                idx % 2 !== 0 ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300',
                'mt-8 space-y-3 text-sm/6 sm:mt-10 flex-grow',
              )}
            >
              {tariff.benefits?.map((benefit) => (
                <li key={benefit.id} className="flex gap-x-3">
                  <CheckIcon
                    aria-hidden="true"
                    className={cn(
                      idx % 2 !== 0 ? 'text-indigo-400' : 'text-indigo-600 dark:text-indigo-400',
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
                  ? 'bg-indigo-500 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-indigo-500 dark:shadow-none'
                  : 'text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 focus-visible:outline-indigo-600 dark:bg-white/10 dark:text-white dark:ring-white/5 dark:hover:bg-white/20 dark:hover:ring-white/5 dark:focus-visible:outline-white/75',
                'mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10',
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
