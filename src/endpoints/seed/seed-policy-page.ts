import type { Payload } from 'payload'
import { Media } from '@/payload-types'
import { privacyPolicy } from './data/privacy-policy'

export const seedPolicyPage = async (payload: Payload, media: { [key: string]: Media }) => {
  payload.logger.info('Создание Home page...')

  await payload.create({
    collection: 'pages',
    depth: 0,
    data: privacyPolicy(),
  })

  payload.logger.info('✓ Home page успешно создана.')
}
