export interface IPostCategoryData {
  title: string
  children: IPostCategoryData[]
}

export const postCategoriesData: IPostCategoryData[] = [
  {
    title: 'Обзоры и статьи',
    children: [],
  },
  {
    title: 'Новости',
    children: [
      {
        title: 'Новости компании',
        children: [],
      },
      {
        title: 'Новости индустрии',
        children: [],
      },
    ],
  },
  {
    title: 'Руководства и советы',
    children: [
      {
        title: 'Руководства по продуктам',
        children: [],
      },
      {
        title: 'Советы по использованию',
        children: [],
      },
    ],
  },
]
