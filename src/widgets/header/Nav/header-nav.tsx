'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'

type HeaderNavProps = {
  data: HeaderType
  pathname?: string
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ data, pathname }) => {
  const navItems = data?.navItems || []

  return (
    <nav className="lg:flex gap-3 items-center hidden ">
      {navItems.map(({ link }, i) => {
        return (
          <CMSLink
            key={i}
            {...link}
            appearance="secondary"
            className={pathname === link.url ? 'text-destructive' : ''}
          />
        )
      })}
      <Link href="/search">
        <span className="sr-only">Search</span>
        <SearchIcon className="w-5 text-primary" />
      </Link>
    </nav>
  )
}
