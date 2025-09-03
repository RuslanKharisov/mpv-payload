import type { Payload } from 'payload'
import { ProductData, productsData } from './data/products-data'

export const seedProducts = async (payload: Payload) => {
  console.log('— Seeding demo products')

  // await payload.db.deleteMany({
  //   collection: 'products',
  //   where: {},
  // })

  productsData.map(async (product: ProductData) => {
    await payload.create({
      collection: 'products',
      data: {
        name: product.name,
        sku: product.sku,
        shortDescription: product.shortDescription,
        productCategory: product.productCategory,
        manufacturer: product.manufacturer,
        productImage: product.productImage,
      },
    })
  })

  console.log('✓ Demo products created successfully.')
}
