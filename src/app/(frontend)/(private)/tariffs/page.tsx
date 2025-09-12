import { cn } from '@/shared/utilities/ui'
import { CheckIcon } from 'lucide-react'

const tiers = [
  {
    name: 'Старт',
    id: '1',
    href: '#',
    priceMonthly: '$29',
    description: "The perfect plan if you're just getting started with our product.",
    features: [
      '25 products',
      'Up to 10,000 subscribers',
      'Advanced analytics',
      '24-hour support response time',
    ],
    featured: false,
  },
  {
    name: 'Enterprise',
    id: '2',
    href: '#',
    priceMonthly: '$99',
    description: 'Dedicated support and infrastructure for your company.',
    features: ['Unlimited products', 'Unlimited subscribers', 'Advanced analytics'],
    featured: true,
  },
  {
    name: 'Про',
    id: '3',
    href: '#',
    priceMonthly: '$99',
    description: 'Dedicated support and infrastructure for your company.',
    features: ['Unlimited products', 'Unlimited subscribers', 'Advanced analytics'],
    featured: false,
  },
]

function page() {
  return (
    <div className="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-8 dark:bg-gray-900">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 dark:opacity-20"
        />
      </div>
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-base/7 font-semibold text-indigo-600 dark:text-indigo-400">Цены</h2>
        <p className="mt-2 text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-6xl dark:text-white">
          Выберите подходящий тариф
        </p>
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-pretty text-center text-lg font-medium text-gray-600 sm:text-xl/8 dark:text-gray-400">
        Выберите доступный тариф с лучшими функциями для взаимодействия с аудиторией, повышения
        лояльности клиентов и стимулирования продаж.
      </p>
      <div className="mx-auto mt-16 grid grid-cols-1  gap-y-6 sm:mt-20 sm:gap-y-0 lg:grid-cols-3 gap-3">
        {tiers.map((tier, tierIdx) => (
          <div
            key={tier.id}
            className={cn(
              tier.featured
                ? 'relative bg-gray-900 shadow-2xl dark:bg-gray-800 dark:shadow-none'
                : 'bg-white/60 sm:mx-8 lg:mx-0 dark:bg-white/[0.025]',
              'flex flex-col p-8 ring-1 ring-gray-900/10 sm:p-10 dark:ring-white/10',
            )}
          >
            <h3
              id={tier.id}
              className={cn(
                tier.featured ? 'text-indigo-400' : 'text-indigo-600 dark:text-indigo-400',
                'text-base/7 font-semibold',
              )}
            >
              {tier.name}
            </h3>
            <p className="mt-4 flex items-baseline gap-x-2">
              <span
                className={cn(
                  tier.featured ? 'text-white' : 'text-gray-900 dark:text-white',
                  'text-5xl font-semibold tracking-tight',
                )}
              >
                {tier.priceMonthly}
              </span>
              <span
                className={cn(
                  tier.featured ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400',
                  'text-base',
                )}
              >
                /month
              </span>
            </p>
            <p
              className={cn(
                tier.featured ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300',
                'mt-6 text-base/7',
              )}
            >
              {tier.description}
            </p>
            <ul
              role="list"
              className={cn(
                tier.featured ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300',
                'mt-8 space-y-3 text-sm/6 sm:mt-10 flex-grow',
              )}
            >
              {tier.features.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <CheckIcon
                    aria-hidden="true"
                    className={cn(
                      tier.featured ? 'text-indigo-400' : 'text-indigo-600 dark:text-indigo-400',
                      'h-6 w-5 flex-none',
                    )}
                  />
                  {feature}
                </li>
              ))}
            </ul>
            <a
              href={tier.href}
              aria-describedby={tier.id}
              className={cn(
                tier.featured
                  ? 'bg-indigo-500 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-indigo-500 dark:shadow-none'
                  : 'text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 focus-visible:outline-indigo-600 dark:bg-white/10 dark:text-white dark:ring-white/5 dark:hover:bg-white/20 dark:hover:ring-white/5 dark:focus-visible:outline-white/75',
                'mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10',
              )}
            >
              Get started today
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default page
