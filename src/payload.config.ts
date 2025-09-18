// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'

import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './payload/collections/Categories'
import { Media } from './payload/collections/Media'
import { Pages } from './payload/collections/Pages'
import { Posts } from './payload/collections/Posts'
import { Users } from './payload/collections/Users'

import { Products } from './payload/collections/Products'

import { Footer } from './widgets/footer/config'
import { Header } from './widgets/header/config'
import { plugins } from './payload/plugins'
import { defaultLexical } from '@/payload/fields/defaultLexical'

import { en } from '@payloadcms/translations/languages/en'
import { ru } from '@payloadcms/translations/languages/ru'

import { getServerSideURL } from '@/shared/utilities/getURL'

import { Brands } from './payload/collections/Brands'
import { ProductCategories } from './payload/collections/ProductCategories'
import { Stocks } from './payload/collections/Stocks'
import { Addresses } from './payload/collections/Addresses'
import { CompanyCertifications } from './payload/collections/CompanyCertifications'
import { CompanyPosts } from './payload/collections/CompanyPosts'
import { CompanyProjects } from './payload/collections/CompanyProjects'
import { CompanyTypes } from './payload/collections/CompanyTypes'
import { Subscriptions } from './payload/collections/Subscriptions'
import { Tariffs } from './payload/collections/Tariffs'
import { Tenants } from './payload/collections/Tenants'
import { Currencies } from './payload/collections/Currencies'

// import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { resendAdapter } from '@payloadcms/email-resend'
import { Warehouses } from './payload/collections/Warehouses'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  i18n: {
    supportedLanguages: { en, ru },
    fallbackLanguage: 'en',
  },
  admin: {
    components: {
      beforeLogin: ['@/components/BeforeLogin'],
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
    meta: {
      titleSuffix: ' - OnStock B2B',
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: postgresAdapter({
    push: process.env.NODE_ENV !== 'production', //!!! Настройка для предотвращения записи изменений в базу в DEV режиме на Production сервере.
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  collections: [
    Products,
    ProductCategories,
    Brands,
    Pages,
    Posts,
    Media,
    Categories,
    Users,
    Stocks,
    Warehouses,
    CompanyProjects,
    CompanyCertifications,
    CompanyPosts,
    Subscriptions,
    Addresses,
    CompanyTypes,
    Tariffs,
    Tenants,
    Currencies,
  ],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer],
  plugins: [
    ...plugins,
    // storage-adapter-placeholder
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        if (req.user) return true
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [],
  },
  email: resendAdapter({
    defaultFromAddress: 'onboarding@resend.dev',
    defaultFromName: 'Prom-Stock',
    apiKey: process.env.RESEND_API || '',
  }),
})
