import { z } from 'zod'

export const DaDataCompanySuggestionSchema = z.object({
  value: z.string(),
  data: z.object({
    inn: z.string(),
    name: z.object({
      short_with_opf: z.string(),
      full_with_opf: z.string().optional(),
    }),
    state: z
      .object({
        status: z
          .enum(['ACTIVE', 'LIQUIDATING', 'LIQUIDATED', 'BANKRUPT', 'REORGANIZING'])
          .optional(),
        actuality_date: z.union([z.string(), z.number(), z.null()]).optional(),
        registration_date: z.union([z.string(), z.number(), z.null()]).optional(),
        liquidation_date: z.union([z.string(), z.number(), z.null()]).optional(),
      })
      .optional(),
  }),
})

export const DaDataCompanyResponseSchema = z.object({
  suggestions: z.array(DaDataCompanySuggestionSchema),
})

export type DaDataCompanySuggestion = z.infer<typeof DaDataCompanySuggestionSchema>
export type DaDataCompanyResponse = z.infer<typeof DaDataCompanyResponseSchema>
