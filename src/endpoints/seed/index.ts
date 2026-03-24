import type { Payload, PayloadRequest } from 'payload'
import { seedTenantsFromJson } from './data/seed-tenants-from-json'
import { seedCompanyTags } from './seed-company-tags'

export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  console.log('Запущен скрипт seed базы данных...')

  await seedCompanyTags(payload)
  await seedTenantsFromJson(payload)

  console.log('✅ Seed завершён')
}
