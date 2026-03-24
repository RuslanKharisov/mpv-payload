'use client'

import React, { memo } from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Profile } from '@/entities/profile/_domain/profile'
import { usePathname } from 'next/navigation'
import { CartIcon } from '../_ui/cart-icon'
import { UserProfile } from '../_ui/user-profile'

type HeaderNavProps = {
  data: HeaderType
  user: Profile
}

export const HeaderNav: React.FC<HeaderNavProps> = memo(({ data, user }) => {
  const pathname = usePathname()
  const navItems = data?.navItems || []

  return (
    <nav className="lg:flex gap-5 items-center hidden ">
      {navItems.map(({ link }, i) => {
        return (
          <CMSLink key={i} {...link} className={pathname === link.url ? 'text-destructive' : ''} />
        )
      })}

      <CartIcon />
      <UserProfile user={user} />
    </nav>
  )
})

HeaderNav.displayName = 'HeaderNav'
