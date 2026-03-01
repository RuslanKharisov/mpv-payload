import z from 'zod'

export const BillingRequestFormSchema = z.object({
  companyName: z.string().min(2, 'Название компании обязательно'),
  email: z.string().email('Введите корректный email'),
  phone: z.string().optional(),
  note: z.string().max(1000).optional(),
  website: z.string().optional(), // honeypot
})

export type BillingRequestFormValues = z.infer<typeof BillingRequestFormSchema>

// вход для tRPC
export const BillingRequestSchema = z.object({
  tariffId: z.number(),
  tariffName: z.string(),
  formData: BillingRequestFormSchema,
})
