// import { getPayload } from 'payload'
// import configPromise from '@payload-config'
// import { cache } from 'react'
// import { Warehouse } from '@/payload-types'

// const getCities = cache(async (region?: string): Promise<string[]> => {
//   try {
//     const payload = await getPayload({ config: configPromise })

//     const where: any = {}
//     if (region) {
//       where['warehouse_address.region'] = { equals: region }
//     }

//     const warehouses = await payload.find({
//       collection: 'warehouses',
//       depth: 1,
//       limit: 1000,
//       where,
//     })

//     const citiesSet = new Set<string>()

//     for (const warehouse of warehouses.docs as Warehouse[]) {
//       if (
//         warehouse.warehouse_address &&
//         typeof warehouse.warehouse_address === 'object' &&
//         'city' in warehouse.warehouse_address
//       ) {
//         const city = warehouse.warehouse_address.city
//         if (city) {
//           citiesSet.add(city)
//         }
//       }
//     }

//     return Array.from(citiesSet).sort()
//   } catch (error) {
//     console.error('Failed to fetch cities:', error)
//     return []
//   }
// })

// export default getCities
