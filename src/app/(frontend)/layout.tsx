import type { Metadata } from 'next'

import { cn } from '@/shared/utilities/ui'
import { Inter, Onest, Playfair_Display } from 'next/font/google'
import React from 'react'

import { Providers } from '@/shared/providers'
import { InitTheme } from '@/shared/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/shared/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/shared/utilities/getURL'
import YandexMetrikaContainer from '@/shared/utilities/YandexMetrika'
import { Toaster } from '@/shared/ui/sonner'
// import { generateMeta } from '@/shared/utilities/generateMeta'

const inter = Inter({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
})

const onest = Onest({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-onest',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  const analyticsEnabled = !!(process.env.NODE_ENV === 'production')

  return (
    <html
      className={cn(inter.variable, onest.variable, inter.className)}
      lang="ru"
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>{children}</Providers>
        <Toaster richColors position="top-right" />
        <YandexMetrikaContainer enabled={analyticsEnabled} />
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
