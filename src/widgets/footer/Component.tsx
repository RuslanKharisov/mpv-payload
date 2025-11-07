import { getCachedGlobal } from '@/shared/utilities/getGlobals'
import React from 'react'

import type { Footer } from '@/payload-types'

import { ThemeSelector } from '@/shared/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { Socials, socialsData } from '@/widgets/socials'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []

  return (
    <footer className="mt-auto border-t border-border bg-slate-950 dark:bg-card text-white pt-10 pb-6">
      <div className="container">
        <div className="flex flex-col items-center gap-6">
          <Logo className="flex-col md:flex-row" />
          <div className="w-full flex flex-col justify-between gap-24 items-center lg:flex-row md:items-center">
            <nav className="flex flex-col flex-grow items-center  md:flex-row gap-5">
              {navItems.map(({ link }, i) => {
                return (
                  <CMSLink
                    className="text-white hover:text-gray-300 transition-colors"
                    key={i}
                    {...link}
                  />
                )
              })}
            </nav>
            <div className="flex flex-col-reverse md:flex-row items-center gap-5">
              <ThemeSelector />
              <Socials socialsData={socialsData} />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center pt-8 gap-5">
          <p className="text-center text-xs">
            © 2024{' '}
            <a
              href="https://www.barbarisstudio.ru/"
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              Studio Barbaris™
            </a>
            . All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
