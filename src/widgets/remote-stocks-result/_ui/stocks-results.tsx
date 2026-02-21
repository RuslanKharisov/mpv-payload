// import { Tenant } from '@/payload-types'
// import { Suspense } from 'react'
// import { SupplierStockLoader } from './supplier-stock-loader'

// export type SearchParams = {
//   sku?: string
//   description?: string
//   page?: string
//   perPage?: string
// }

// export async function StocksResults({
//   searchParams,
//   suppliersList,
// }: {
//   suppliersList: Tenant[]
//   searchParams: SearchParams
// }) {
//   const filters = {
//     sku: searchParams.sku?.trim() || '',
//     description: searchParams.description?.trim() || '',
//   }

//   const pagination = {
//     page: searchParams.page || '1',
//     perPage: searchParams.perPage || '5',
//   }

//   if (suppliersList.length === 0) {
//     return (
//       <div className="rounded-lg bg-gray-50 py-16 text-center dark:bg-gray-800">
//         <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
//           Нет доступных поставщиков для поиска.
//         </p>
//       </div>
//     )
//   }

//   return (
//     <div className="flex flex-col gap-10">
//       {suppliersList.map((supplier, i) => (
//         <Suspense key={i} fallback={<div>Загрузка данных ...</div>}>
//           <SupplierStockLoader supplier={supplier} filters={filters} pagination={pagination} />
//         </Suspense>
//       ))}
//     </div>
//   )
// }
