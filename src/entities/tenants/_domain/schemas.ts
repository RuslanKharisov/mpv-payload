import z from 'zod'

export const TenantUpdateSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  name: z.string().min(1, { message: 'Название компании обязательно' }),
  requestEmail: z.email({ message: 'Введите корректный email' }),
  domain: z.string().optional(),
  inn: z.string().min(10).max(12).optional().nullable(),
  status: z
    .enum(['ACTIVE', 'LIQUIDATING', 'LIQUIDATED', 'BANKRUPT', 'REORGANIZING'])
    .optional()
    .nullable(),
})

export type TenantUpdateInput = z.infer<typeof TenantUpdateSchema>
