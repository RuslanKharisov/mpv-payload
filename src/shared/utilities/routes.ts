export const getRouteHome = () => '/'

export const getRouteProductCategories = () => '/product-categories'
export const getRouteProductCategoriesPaginated = (pageNum: number) =>
  `${getRouteProductCategories()}/page/${pageNum}`
export const getRouteProductCategoriesBySlug = (slug: string) =>
  `${getRouteProductCategories()}/${slug}`
