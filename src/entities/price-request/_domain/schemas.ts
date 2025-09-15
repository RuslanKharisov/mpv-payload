import z from 'zod'

// 👇 базовая схема для формы
export const SendPriceRequestSchema = z.object({
  deliveryTime: z.enum([
    'ANY',
    'NEXT_DAY',
    'TWO_TREE_DAYS',
    'FOUR_SIX_DAYS',
    'TEN_PLUS_DAYS',
    'SEVEN_TEN_DAYS',
    'EMERGENCY',
  ]),
  note: z.string().optional(),
  firstName: z.string().min(1, 'Введите имя'),
  lastName: z.string().min(1, 'Введите фамилию'),
  phone: z.string().min(1, 'Введите номер телефона'),
  email: z.string().email('Некорректный email'),
  companyName: z.string().min(1, 'Введите название компании'),
})

// 👇 основная схема запроса (использует SendPriceRequestSchema)
export const PriceRequestSchema = z.object({
  tenantName: z.string(),
  tenantEmail: z.string(),
  formData: SendPriceRequestSchema,
  items: z.array(
    z.object({
      item: z.object({
        id: z.string(),
        sku: z.string(),
        description: z.string(),
        supplierName: z.string(),
        currencyCode: z.string(),
      }),
      quantity: z.number(),
    }),
  ),
})

// Типы
export type SendPriceRequestFormValues = z.infer<typeof SendPriceRequestSchema>
export type PriceRequestValues = z.infer<typeof PriceRequestSchema>
export type PriceRequestItem = PriceRequestValues['items'][number]
