'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'
import { Logo } from '@/components/Logo/Logo'

type MobileNavProps = {
  data: HeaderType
  onClose: () => void
  pathname?: string
}

export const MobileNav: React.FC<MobileNavProps> = ({ data, onClose, pathname }) => {
  const navItems = data?.navItems || []

  return (
    <div className="bg-background flex h-dvh w-full flex-col space-y-2 px-4">
      {/* 3. Добавляем `onClick` ко всем кликабельным элементам */}
      <div onClick={onClose} className="cursor-pointer">
        <Logo />
      </div>

      {navItems.map(({ link }, i) => {
        return (
          <div key={i} onClick={onClose}>
            <CMSLink
              {...link}
              appearance="secondary"
              className={`${pathname === link.url ? 'text-destructive' : ''} w-full`}
            />
          </div>
        )
      })}

      <Link href="/search" onClick={onClose}>
        <span className="sr-only">Search</span>
        <SearchIcon className="w-5 text-primary" />
      </Link>
    </div>
  )
}
