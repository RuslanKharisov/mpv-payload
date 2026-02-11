import z from 'zod'

export const GeneralSearchSchema = z.object({
  productName: z.string().min(3, 'Введите название или артикул'),
  email: z.email('Некорректный email'),
  companyName: z.string().min(2, 'Введите название компании'),
  phone: z.string().min(6, 'Введите номер телефона').or(z.literal('')).optional(),
  note: z.string().optional(),
  website: z.string().optional(),
})

export type GeneralSearchRequestValues = z.infer<typeof GeneralSearchSchema>
