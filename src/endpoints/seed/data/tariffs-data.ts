import { Tariff } from '@/payload-types'

export type TariffData = {
  name: string
  price: number
  description: string
  benefits: { value: string }[]
  features: Tariff['features']
}

export const tariffsData: TariffData[] = [
  {
    name: 'Старт',
    price: 0,
    description:
      'Для поставщиков, которые хотят "зайти" на платформу с минимальными усилиями. Базовая видимость и автоматическое участие в поиске.',
    benefits: [
      { value: 'Автоматическое участие в поиске' },
      { value: 'Подключение склада по API' },
      { value: 'Профиль компании с базовой информацией' },
    ],
    features: ['CANT_ANY'],
  },
  {
    name: 'Стандарт',
    price: 1900, // например, 1900₽/мес
    description:
      'Для поставщиков, которые хотят активно управлять своим присутствием и строить доверие. Добавление товаров вручную, корпоративный блог.',
    benefits: [
      { value: 'Все возможности тарифа «Старт»' },
      { value: 'Ручное управление складом' },
      { value: 'Корпоративный блог' },
    ],
    features: ['CAN_MANAGE_STOCK', 'CAN_CREATE_POSTS'],
  },
  {
    name: 'Про',
    price: 4900, // например, 4900₽/мес
    description:
      'Для компаний, которые хотят доминировать на площадке. Продвижение товаров, аналитика и приоритетная поддержка.',
    benefits: [
      { value: 'Все возможности тарифа «Стандарт»' },
      { value: 'Продвижение товаров на главной и в категориях' },
    ],
    features: ['CAN_MANAGE_STOCK', 'CAN_CREATE_POSTS', 'CAN_PROMOTE_PRODUCTS'],
  },
]
