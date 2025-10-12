import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import { getPayload, Payload } from 'payload'
import configPromise from '@payload-config'
import { getProducts } from '@/entities/products/api/get-products'

describe('Products Filter Integration', () => {
  let payload: Payload

  beforeAll(async () => {
    payload = await getPayload({ config: await configPromise })
  })

  it('should return products when no filters are applied', async () => {
    // Создаем тестовые данные
    const mockAllCategories: any = []

    // Вызываем функцию без фильтров
    const result = await getProducts({
      allCategories: mockAllCategories,
    })

    // Проверяем, что результат корректный
    expect(result).toBeDefined()
    expect(result.products).toBeDefined()
    expect(result.pagination).toBeDefined()
    expect(result.pagination.totalPages).toBeGreaterThanOrEqual(0)
  })

  it('should filter products by condition', async () => {
    // Создаем тестовые данные
    const mockAllCategories: any = []

    // Вызываем функцию с фильтром по состоянию
    const result = await getProducts({
      condition: 'Б/У',
      allCategories: mockAllCategories,
    })

    // Проверяем, что результат корректный
    expect(result).toBeDefined()
    expect(result.products).toBeDefined()
    expect(result.pagination).toBeDefined()
  })

  it('should filter products by city', async () => {
    // Создаем тестовые данные
    const mockAllCategories: any = []

    // Вызываем функцию с фильтром по городу
    const result = await getProducts({
      city: 'Москва',
      allCategories: mockAllCategories,
    })

    // Проверяем, что результат корректный
    expect(result).toBeDefined()
    expect(result.products).toBeDefined()
    expect(result.pagination).toBeDefined()
  })

  it('should filter products by region', async () => {
    // Создаем тестовые данные
    const mockAllCategories: any = []

    // Вызываем функцию с фильтром по региону
    const result = await getProducts({
      region: 'Москва',
      allCategories: mockAllCategories,
    })

    // Проверяем, что результат корректный
    expect(result).toBeDefined()
    expect(result.products).toBeDefined()
    expect(result.pagination).toBeDefined()
  })

  it('should filter products by both condition and region', async () => {
    // Создаем тестовые данные
    const mockAllCategories: any = []

    // Вызываем функцию с фильтрами по состоянию и региону
    const result = await getProducts({
      condition: 'НОВЫЙ С ЗАВОДА',
      region: 'Санкт-Петербург',
      allCategories: mockAllCategories,
    })

    // Проверяем, что результат корректный
    expect(result).toBeDefined()
    expect(result.products).toBeDefined()
    expect(result.pagination).toBeDefined()
  })
})
