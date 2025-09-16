import { Product } from '@/payload-types'

export interface ProductData {
  name: string
  sku: string
  shortDescription: string
  productCategory: number
  brand?: number
  productImage: number
}

export const productsData: ProductData[] = [
  {
    name: 'SIMATIC S7-1200 CPU 1212C (DC/DC/DC)',
    sku: '6ES7212-1AE40-0XB0',
    shortDescription:
      'Компактный контроллер SIMATIC S7-1200 с интегрированными 8 DI, 6 DO и 2 AI, питание DC.',
    productCategory: 14,
    brand: 1,
    productImage: 10,
  },
  {
    name: 'SIMATIC S7-1200 CPU 1212C (AC/DC/Relay)',
    sku: '6ES7212-1BE40-0XB0',
    shortDescription: 'Версия CPU с релейными выходами (AC/DC/Relay), альтернативная конфигурация.',
    productCategory: 14,
    brand: 1,
    productImage: 10,
  },
  {
    name: 'SIMATIC HMI KTP700 Basic',
    sku: '6AV2123-2GB03-0AX0',
    shortDescription: '7″ HMI-панель с TFT-дисплеем, 8-клавишная панель, Ethernet, IP65.',
    productCategory: 14,
    brand: 1,
    productImage: 10,
  },
  {
    name: 'SIMATIC S7-1500 CPU 1511-1 PN',
    sku: '6ES7511-1AK02-0AB0',
    shortDescription:
      'Мощный контроллер с интегрированными интерфейсами PROFINET, высокая производительность.',
    productCategory: 14,
    brand: 1,
    productImage: 10,
  },
  {
    name: 'SINAMICS G120C Frequency Converter 0.75kW',
    sku: '6SL3210-5BE17-5UV0',
    shortDescription: 'Компактный частотный преобразователь для стандартных применений, 0.75 кВт.',
    productCategory: 14,
    brand: 1,
    productImage: 10,
  },
  {
    name: 'SIMATIC ET 200SP CPU 1512SP-1 PN',
    sku: '6ES7512-1SK02-0AB0',
    shortDescription: 'Компактный CPU для распределенной периферии ET 200SP, PROFINET interface.',
    productCategory: 14,
    brand: 1,
    productImage: 10,
  },
  {
    name: 'SIMATIC HMI TP700 Comfort',
    sku: '6AV2124-0MC01-0AX0',
    shortDescription: '7″ HMI-панель Comfort с сенсорным экраном, высокая производительность.',
    productCategory: 14,
    brand: 1,
    productImage: 10,
  },
  {
    name: 'SIRIUS 3SU1 Push Button',
    sku: '3SU1100-1AA10-1BA0',
    shortDescription: 'Кнопка пуска с подсветкой, пластиковый корпус, IP65.',
    productCategory: 14,
    brand: 1,
    productImage: 10,
  },
  {
    name: 'SIMATIC SM 1221 Digital Input Module',
    sku: '6ES7221-1BF32-0XB0',
    shortDescription: 'Модуль цифровых входов 16x24VDC для S7-1200.',
    productCategory: 14,
    brand: 1,
    productImage: 10,
  },
  {
    name: 'SIMATIC SM 1222 Digital Output Module',
    sku: '6ES7222-1BF32-0XB0',
    shortDescription: 'Модуль цифровых выходов 16x24VDC для S7-1200.',
    productCategory: 14,
    brand: 1,
    productImage: 10,
  },
  {
    name: 'SIMATIC SM 1231 Analog Input Module',
    sku: '6ES7231-4HF32-0XB0',
    shortDescription: 'Модуль аналоговых входов 4xAI для S7-1200.',
    productCategory: 14,
    brand: 1,
    productImage: 10,
  },
  {
    name: 'SIMATIC SM 1232 Analog Output Module',
    sku: '6ES7232-4HB32-0XB0',
    shortDescription: 'Модуль аналоговых выходов 2xAO для S7-1200.',
    productCategory: 14,
    brand: 1,
    productImage: 10,
  },
  {
    name: 'SINAMICS V20 Frequency Converter 1.5kW',
    sku: '6SL3210-5BE21-5UV0',
    shortDescription: 'Частотный преобразователь для простых применений, 1.5 кВт.',
    productCategory: 14,
    brand: 1,
    productImage: 10,
  },
  {
    name: 'SIMATIC Memory Card 4MB',
    sku: '6ES7954-8LC02-0AA0',
    shortDescription: 'Карта памяти для SIMATIC S7-1200/1500, 4 МБ.',
    productCategory: 14,
    brand: 1,
    productImage: 10,
  },
  {
    name: 'SIRIUS 3RT2 Contactor 25A',
    sku: '3RT2015-1AP00',
    shortDescription: 'Контактор 25А, 3 полюса, катушка 24VDC.',
    productCategory: 14,
    brand: 1,
    productImage: 10,
  },
  {
    name: 'SIMATIC PS 1204 Power Supply',
    sku: '6EP1332-1SH71',
    shortDescription: 'Источник питания 24VDC/4A для SIMATIC системы.',
    productCategory: 14,
    brand: 1,
    productImage: 10,
  },
  {
    name: 'SIMATIC NET CP 1243-1 Communication Processor',
    sku: '6GK7243-1EX30-0XE0',
    shortDescription: 'Коммуникационный процессор для удаленного доступа по Ethernet.',
    productCategory: 14,
    brand: 1,
    productImage: 10,
  },
  {
    name: 'SIMATIC HMI KTP400 Basic',
    sku: '6AV2123-2DB03-0AX0',
    shortDescription: '3.8″ HMI-панель Basic, компактное решение для простых задач.',
    productCategory: 14,
    brand: 1,
    productImage: 10,
  },
  {
    name: 'SIMATIC S7-1200 CPU 1214C (DC/DC/DC)',
    sku: '6ES7214-1AG40-0XB0',
    shortDescription: 'CPU с расширенными возможностями, 14 DI, 10 DO, 2 AI.',
    productCategory: 14,
    brand: 1,
    productImage: 10,
  },
  {
    name: 'SIRIUS 3SE5 Position Switch',
    sku: '3SE5201-0HA20-1AA0',
    shortDescription: 'Позиционный выключатель с роликовым рычагом, IP67.',
    productCategory: 14,
    brand: 1,
    productImage: 10,
  },
]
