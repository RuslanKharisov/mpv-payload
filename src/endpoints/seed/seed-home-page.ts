import type { Payload } from 'payload'
import { home } from './data/home'
import { Media } from '@/payload-types'

export const seedHomePage = async (payload: Payload, media: { [key: string]: Media }) => {
  payload.logger.info('Создание Home page...')

  await payload.create({
    collection: 'pages',
    depth: 0,
    data: home({ heroImage: media.imageHomeDoc, metaImage: media.image2Doc }),
  })

  payload.logger.info('✓ Home page успешно создана.')
}
