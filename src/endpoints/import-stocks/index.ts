import { formatSku } from '@/payload/fields/skuNormalized/formatSku'
import { Endpoint, PayloadRequest } from 'payload'
import * as XLSX from 'xlsx'
import { z } from 'zod'

// Схема Zod остается такой же
const stockRowSchema = z.object({
  sku: z.string().trim().min(1, { message: 'SKU не может быть пустым' }),
  name: z.string().optional(),
  quantity: z.number().min(0).default(0),
  price: z.number().optional(),
  currency: z.string().trim().toUpperCase().optional(),
  condition: z.enum(['Новый', 'Б/У', 'Без упаковки']).optional(),
  expectedDelivery: z.date().optional(),
  warranty: z.number().optional(),
  warehouse: z.string().optional(),
})

export const importStocksEndpoint: Endpoint = {
  path: '/import-stocks',
  method: 'post',
  // ИЗМЕНЕНИЕ 1: Сигнатура обработчика теперь другая. Он должен возвращать Promise<Response>.
  handler: async (req: PayloadRequest): Promise<Response> => {
    // Проверяем, что пользователь авторизован
    if (!req.user) {
      // ИЗМЕНЕНИЕ 2: Возвращаем Response.json вместо res.status().json()
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Получаем ID тенанта из текущего пользователя
    const tenant = req.user.tenants?.[0]?.tenant || null

    if (!tenant) {
      return Response.json(
        { success: false, error: 'Не удалось определить тенанта для пользователя.' },
        { status: 400 },
      )
    }

    const tenantId = typeof tenant === 'number' ? tenant : tenant.id

    console.log('tenantId ==> ', tenantId)

    try {
      // ИЗМЕНЕНИЕ 3: Получаем данные формы, включая файл
      if (!req.formData) {
        return Response.json(
          { success: false, error: 'Invalid request: expected multipart/form-data' },
          { status: 400 },
        )
      }
      const formData = await req.formData()
      const file = formData.get('file') as File // Получаем файл по ключу 'file'

      if (!file) {
        return Response.json({ success: false, error: 'Файл не был загружен' }, { status: 400 })
      }

      // Преобразуем файл в буфер для чтения библиотекой xlsx
      const buffer = Buffer.from(await file.arrayBuffer())
      const workbook = XLSX.read(buffer, { type: 'buffer' })
      const sheetName = workbook.SheetNames[1]
      const sheet = workbook.Sheets[sheetName]
      const rows: any[] = XLSX.utils.sheet_to_json(sheet)

      const errors: string[] = []
      const successes: string[] = []

      for (const [index, row] of rows.entries()) {
        const rowIndex = index + 2

        const validation = stockRowSchema.safeParse({
          ...row,
          expectedDelivery: row['expectedDelivery'] ? new Date(row['expectedDelivery']) : undefined,
        })

        if (!validation.success) {
          const errorMessages = validation.error.issues
            .map((e) => `Строка ${rowIndex}: Поле '${e.path.join('.')}' - ${e.message}`)
            .join('; ')
          errors.push(errorMessages)
          continue
        }

        const {
          sku,
          name,
          currency: currencyCode,
          warehouse: warehouseTitle,
          ...restOfStockData
        } = validation.data

        if (!currencyCode) {
          errors.push(`Строка ${rowIndex}: Код валюты (currency) является обязательным полем.`)
          continue
        }

        // Находим ID валюты по коду
        const currencyResult = await req.payload.find({
          collection: 'currencies',
          where: { code: { equals: currencyCode } },
          limit: 1,
        })
        const currencyDoc = currencyResult.docs[0]

        if (!currencyDoc) {
          errors.push(`Строка ${rowIndex}: Валюта с кодом '${currencyCode}' не найдена.`)
          continue
        }
        const currencyId = currencyDoc.id // Теперь это всегда number

        // Находим ID склада по названию
        let warehouseId: number | undefined
        if (warehouseTitle) {
          const warehouseResult = await req.payload.find({
            collection: 'warehouses',
            where: { title: { equals: warehouseTitle } }, // ВАЖНО: ищем по полю 'title'
            limit: 1,
          })
          const warehouseDoc = warehouseResult.docs[0]
          if (!warehouseDoc) {
            errors.push(`Строка ${rowIndex}: Склад с названием '${warehouseTitle}' не найден.`)
            continue // Пропускаем
          }
          warehouseId = warehouseDoc.id
        }

        // Обновляем входные данные для запаса с найденными ID

        let product

        // НОРМАЛИЗУЕМ SKU ИЗ EXCEL-ФАЙЛА
        const normalizedSku = formatSku(sku)

        const existingProducts = await req.payload.find({
          collection: 'products',
          where: {
            sku_normalized: { equals: normalizedSku },
          },
          limit: 1,
        })

        product = existingProducts.docs[0]

        if (!product) {
          product = await req.payload.create({
            collection: 'products',
            data: {
              sku,
              name: name || 'Без названия',
            },
          })
        }

        const stockData = {
          ...restOfStockData, // quantity, price, etc.
          product: product.id,
          tenant: tenantId,
          title_in_admin: `${product.name} (SKU: ${sku})`,
          currency: currencyId,
          warehouse: warehouseId,
          expectedDelivery: validation.data.expectedDelivery
            ? validation.data.expectedDelivery.toISOString()
            : undefined,
        }

        const whereClause: any = {
          product: { equals: product.id },
          tenant: { equals: tenantId },
          warehouse: { equals: warehouseId || null },
        }

        const existingStock = await req.payload.find({
          collection: 'stocks',
          where: whereClause,
          limit: 1,
        })

        if (existingStock.docs.length > 0) {
          await req.payload.update({
            collection: 'stocks',
            id: existingStock.docs[0].id,
            data: stockData,
          })
          successes.push(`SKU ${sku}: Запас обновлен.`)
        } else {
          await req.payload.create({
            collection: 'stocks',
            data: stockData,
          })
          successes.push(`SKU ${sku}: Запас создан.`)
        }
      }

      if (errors.length > 0) {
        return Response.json(
          {
            success: false,
            message: 'Импорт завершен с ошибками.',
            errors,
            successCount: successes.length,
          },
          { status: 400 },
        )
      }

      return Response.json(
        { success: true, message: `Успешно импортировано ${successes.length} записей.` },
        { status: 200 },
      )
    } catch (err: any) {
      console.error('Import Error:', err)
      return Response.json(
        { success: false, error: err.message || 'Произошла внутренняя ошибка сервера' },
        { status: 500 },
      )
    }
  },
}
