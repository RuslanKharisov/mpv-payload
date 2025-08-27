// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'

import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'

import { Companies } from './collections/Companies'
import { Products } from './collections/Products'

import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

import { Manufacturers } from './collections/Manufacturers'
import { ProductCategories } from './collections/ProductCategories'
import { Stocks } from './collections/Stocks'
import { Addresses } from './collections/Addresses'
import { CompanyCertifications } from './collections/CompanyCertifications'
import { CompanyPosts } from './collections/CompanyPosts'
import { CompanyProjects } from './collections/CompanyProjects'
import { CompanyTypes } from './collections/CompanyTypes'
import { Subscriptions } from './collections/Subscriptions'
import { Tariffs } from './collections/Tariffs'
import { Tenants } from './collections/Tenants'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      // Компонент `BeforeLogin` отображает сообщение, которое вы видите при входе в панель администратора.
      // Вы можете удалить его в любое время. Просто удалите строку ниже.
      beforeLogin: ['@/components/BeforeLogin'],
      // Компонент `BeforeDashboard` отображает блок приветствия, который вы видите после входа в панель администратора.
      // Вы можете удалить его в любое время. Просто удалите строку ниже.
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
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  collections: [
    Companies,
    Products,
    ProductCategories,
    Manufacturers,
    Pages,
    Posts,
    Media,
    Categories,
    Users,
    Stocks,
    CompanyProjects,
    CompanyCertifications,
    CompanyPosts,
    Subscriptions,
    Addresses,
    CompanyTypes,
    Tariffs,
    Tenants,
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
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [],
  },
})
