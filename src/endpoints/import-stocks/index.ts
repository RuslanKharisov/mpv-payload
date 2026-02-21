import { formatSku } from '@/payload/fields/skuNormalized/formatSku'
import { Endpoint, PayloadRequest } from 'payload'
import * as XLSX from 'xlsx'
import { z } from 'zod'

type WhereOperator<T> = { equals: T }

type StockWhereClause = {
  product: WhereOperator<number>
  tenant: WhereOperator<number | string>
  warehouse: WhereOperator<number | null>
}

const stockRowSchema = z.object({
  sku: z
    .union([z.string(), z.number()]) // Принимаем строку или число
    .transform((val) => String(val).trim()) // Преобразуем в строку и убираем пробелы
    .pipe(z.string().min(1, { message: 'SKU не может быть пустым' })),
  name: z.string(),
  quantity: z.coerce.number({ error: 'Должно быть числом' }),
  price: z.coerce.number().optional(),
  currency: z.string().trim().toUpperCase().optional(),
  condition: z.enum(['НОВЫЙ С ЗАВОДА', 'НОВЫЙ ИЗЛИШЕК', 'Б/У', 'ВОССТАНОВЛЕН']),
  expectedDelivery: z.date().optional(),
  warranty: z.coerce.number(),
  warehouse: z.string(),
  category: z.string(),
  brand: z.string(),
})

type ImportStockTableRows = z.infer<typeof stockRowSchema>

export const importStocksEndpoint: Endpoint = {
  path: '/import-stocks',
  method: 'post',
  handler: async (req: PayloadRequest): Promise<Response> => {
    if (!req.user) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const tenant = req.user.tenants?.[0]?.tenant || null

    if (!tenant) {
      return Response.json(
        { success: false, error: 'Не удалось определить тенанта для пользователя.' },
        { status: 400 },
      )
    }

    const tenantId = typeof tenant === 'number' ? tenant : tenant.id

    try {
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

      const buffer = Buffer.from(await file.arrayBuffer())
      const workbook = XLSX.read(buffer, { type: 'buffer' })
      const sheetName = workbook.SheetNames[1]
      if (!sheetName) {
        return Response.json(
          { success: false, error: 'Рабочая книга не содержит второго листа.' },
          { status: 400 },
        )
      }
      const sheet = workbook.Sheets[sheetName]

      const rows: ImportStockTableRows[] = XLSX.utils.sheet_to_json(sheet)

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
          category: categoryName,
          brand: brandName,
          ...restOfStockData
        } = validation.data

        if (!currencyCode) {
          errors.push(`Строка ${rowIndex}: Код валюты (currency) является обязательным полем.`)
          continue
        }

        // --- Находим ID валюты по коду ---
        const currencyResult = await req.payload.find({
          collection: 'currencies',
          where: { code: { equals: currencyCode } },
          limit: 1,
        })
        const currencyDoc = currencyResult.docs[0]

        if (!currencyDoc) {
          errors.push(
            `Строка ${rowIndex}: Валюта с кодом '${currencyCode}' не найдена. ` +
              `Обратитесь к администратору для добавления новой валюты.`,
          )
          continue
        }
        const currencyId = currencyDoc.id // Теперь это всегда number

        // --- Находим ID склада по названию ---
        let warehouseId: number | undefined
        if (warehouseTitle) {
          const warehouseResult = await req.payload.find({
            collection: 'warehouses',
            where: { title: { equals: warehouseTitle } }, // ВАЖНО: ищем по полю 'title'
            limit: 1,
          })
          const warehouseDoc = warehouseResult.docs[0]
          if (!warehouseDoc) {
            errors.push(
              `Строка ${rowIndex}: Склад с названием '${warehouseTitle}' не найден. ` +
                `Обратитесь к администратору для добавления нового склада.`,
            )
            continue
          }
          warehouseId = warehouseDoc.id
        }

        // --- Находим ID категории по названию ---
        let categoryId: number | undefined
        if (categoryName) {
          const categoryResult = await req.payload.find({
            collection: 'product-categories',
            where: { title: { equals: categoryName } },
            limit: 1,
          })
          if (!categoryResult.docs[0]) {
            errors.push(
              `Строка ${rowIndex}: Категория '${categoryName}' не найдена. ` +
                `Обратитесь к администратору для добавления новой категории.`,
            )
            continue
          }
          categoryId = categoryResult.docs[0].id
        }

        // --- Находим ID бренда по названию ---
        let brandId: number | undefined
        if (brandName) {
          const brandResult = await req.payload.find({
            collection: 'brands', // Убедитесь, что слаг коллекции 'brands'
            where: { name: { equals: brandName } },
            limit: 1,
          })
          if (!brandResult.docs[0]) {
            errors.push(
              `Строка ${rowIndex}: Бренд '${brandName}' не найден. ` +
                `Обратитесь к администратору для добавления нового бренда.`,
            )
            continue
          }
          brandId = brandResult.docs[0].id
        }

        // --- Обновляем входные данные для запаса с найденными ID ---

        let product

        // --- НОРМАЛИЗУЕМ SKU ИЗ EXCEL-ФАЙЛА ---
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
              productCategory: categoryId,
              brand: brandId,
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

        try {
          const whereClause: StockWhereClause = {
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
        } catch (dbError: unknown) {
          const message =
            dbError && typeof dbError === 'object' && 'message' in dbError
              ? String((dbError as { message: unknown }).message)
              : 'Неизвестная ошибка БД'

          errors.push(`Строка ${rowIndex} (SKU: ${sku}): ${message}`)
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
    } catch (err: unknown) {
      console.error('Import Error:', err)

      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'Произошла внутренняя ошибка сервера'

      return Response.json({ success: false, error: message }, { status: 500 })
    }
  },
}
