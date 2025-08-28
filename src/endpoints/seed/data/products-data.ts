export interface ProductData {
  name: string
  sku: string
  shortDescription: string
  productCategory: string // slug категории или id
  manufacturer?: string // slug производителя
  imageUrl: string
  galleryUrls?: string[]
}

export const productsData: ProductData[] = [
  {
    name: 'SIMATIC S7-1200 CPU 1212C (DC/DC/DC)',
    sku: '6ES7212-1AE40-0XB0',
    shortDescription:
      'Компактный контроллер SIMATIC S7-1200 с интегрированными 8 DI, 6 DO и 2 AI, питание DC.',
    productCategory: 'plc',
    manufacturer: 'Siemens',
    imageUrl: 'https://www.automation24.com/siemens-cpu-1212c-6es7212-1ae40-0xb0', // изображение CPU
    galleryUrls: [],
  },
  {
    name: 'SIMATIC S7-1200 CPU 1212C (AC/DC/Relay)',
    sku: '6ES7212-1BE40-0XB0',
    shortDescription: 'Версия CPU с релейными выходами (AC/DC/Relay), альтернативная конфигурация.',
    productCategory: 'plc',
    manufacturer: 'Siemens',
    imageUrl: 'https://consteel-electronics.com/S7-1200-6ES7212-1BE40-0XB0-EN', // изображение релейной версии
    galleryUrls: [],
  },
  {
    name: 'SIMATIC HMI KTP700 Basic',
    sku: '6AV2123-2GB03-0AX0',
    shortDescription: '7″ HMI-панель с TFT-дисплеем, 8-клавишная панель, Ethernet, IP65.',
    productCategory: 'hmi',
    manufacturer: 'Siemens',
    imageUrl:
      'https://www.steinerelectric.com/Product/Siemens-KTP700-HMI-Basic-Panel85-9-mm-H-x-154-1-mm-W-TFT-Display8-KeysEthernet-812050', // изображение панели
    galleryUrls: [
      'https://www.amazon.com/6AV2123-2GB03-0AX0-SIEMENS-SIMATIC-KTP700-Basic/dp/B07JVYDSLM', // альтернативное изображение
    ],
  },
]
