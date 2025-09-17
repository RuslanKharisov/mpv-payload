import { ProductCategory } from '@/payload-types'
import { WithPopulatedMany } from '@/shared/utilities/payload-types-extender'

export type ProductCategoryWithParents = WithPopulatedMany<
  ProductCategory,
  { parent: ProductCategory | null | undefined }
>
