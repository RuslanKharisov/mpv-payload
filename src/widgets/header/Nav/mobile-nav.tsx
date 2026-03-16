'use client'

import React, { memo } from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { UserProfile } from '../_ui/user-profile'
import { Profile } from '@/entities/profile/_domain/profile'

type MobileNavProps = {
  data: HeaderType
  user: Profile
  onClose: () => void
  pathname?: string
}

export const MobileNav: React.FC<MobileNavProps> = memo(({ data, user, onClose, pathname }) => {
  const navItems = data?.navItems || []

  return (
    <div className="bg-background flex h-dvh w-full flex-col space-y-5 px-4">
      <div className="text-left">
        <Logo onClick={onClose} />
      </div>

      {user?.id && <UserProfile user={user} />}

      <div className="space-y-2">
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
      </div>
    </div>
  )
})

MobileNav.displayName = 'MobileNav'
