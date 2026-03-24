import type { Payload, PayloadRequest } from 'payload'
import { syncAllTenants } from './syncAllTenants'

export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  console.log('Запущен скрипт seed базы данных...')

  await syncAllTenants(payload)

  console.log('✅ Seed завершён')
}
