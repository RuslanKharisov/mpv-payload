'use server'

import { DaDataCompanyResponse } from '../_domain/da-data-company-response.dto'
import { z } from 'zod'

const DADATA_API_URL = process.env.DADATA_API_URL
const DADATA_API_TOKEN = process.env.DADATA_API_TOKEN

const DaDataCompanySuggestionSchema = z.object({
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

const DaDataCompanyResponseSchema = z.object({
  suggestions: z.array(DaDataCompanySuggestionSchema),
})

/**
 * отправляет запрос компании по инн к апи сервиса:
 * https://dadata.ru/
 */
export const findCompanyByInn = async (query: string): Promise<DaDataCompanyResponse> => {
  if (!DADATA_API_URL || !DADATA_API_TOKEN) {
    throw new Error('DaData API configuration error')
  }

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Token ' + DADATA_API_TOKEN,
    },
    body: JSON.stringify({ query }),
  }

  try {
    const res = await fetch(DADATA_API_URL, options)

    if (!res.ok) {
      throw new Error(`DaData API request failed with status ${res.status}`)
    }

    const data = await res.json()
    const validatedData = DaDataCompanyResponseSchema.parse(data)
    return validatedData
  } catch (error) {
    console.error('Error in findCompanyByInn:', error)
    throw error
  }
}
