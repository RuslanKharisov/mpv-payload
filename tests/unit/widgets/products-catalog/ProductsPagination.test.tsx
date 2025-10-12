import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ProductsPagination } from '@/widgets/products-catalog/_ui/products-pagination'

describe('ProductsPagination', () => {
  it('should render pagination with filter parameters', () => {
    // Рендерим компонент с параметрами фильтров
    const { container } = render(
      <ProductsPagination
        page={1}
        totalPages={3}
        route="products"
        extraParams={{
          condition: 'Б/У',
          city: 'Москва',
          region: 'Москва',
          category: 'test-category',
        }}
      />,
    )

    // Проверяем, что компонент отрендерился
    expect(container).toBeTruthy()
  })

  it('should generate correct URLs with filter parameters', () => {
    const { getAllByText } = render(
      <ProductsPagination
        page={1}
        totalPages={3}
        route="products"
        extraParams={{ condition: 'Б/У', city: 'Москва', region: 'Москва' }}
      />,
    )

    // Проверяем, что ссылки содержат параметры фильтров
    const pageLinks = getAllByText('2')
    // Берем первую ссылку на страницу 2
    const nextPageLink = pageLinks[0].closest('a') as HTMLAnchorElement

    // Проверяем, что URL содержит закодированные параметры
    expect(nextPageLink.href).toContain('condition=%D0%91%2F%D0%A3') // 'Б/У' в URL-кодировке
    expect(nextPageLink.href).toContain('city=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0') // 'Москва' в URL-кодировке
    expect(nextPageLink.href).toContain('region=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0') // 'Москва' в URL-кодировке
  })
})
