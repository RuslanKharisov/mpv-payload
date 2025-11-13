import type { CollectionConfig } from 'payload'

import { fileURLToPath } from 'url'
import path from 'path'
import { anyone } from '../access/anyone'
import { isSuperAdminAccess } from '../access/isSuperAdmin'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Icons: CollectionConfig = {
  slug: 'icons',
  labels: {
    singular: 'Иконка',
    plural: 'Иконки',
  },
  admin: {
    useAsTitle: 'label',
  },
  access: {
    read: anyone,
    create: isSuperAdminAccess,
    update: isSuperAdminAccess,
    delete: isSuperAdminAccess,
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
      label: 'Название (для админки)',
    },
    {
      name: 'key',
      type: 'text',
      required: true,
      unique: true,
      label: 'Ключ',
      admin: {
        description: 'Уникальное имя для программного использования (например: search, database)',
      },
    },
  ],
  upload: {
    staticDir: path.resolve(dirname, '../../../public/media/icons'),
    mimeTypes: ['image/svg+xml'],
    imageSizes: [],
  },
}
