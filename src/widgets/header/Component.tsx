import React from 'react'
import type { Header as HeaderType } from '@/payload-types'
import { getCachedGlobal } from '@/shared/utilities/getGlobals'
import { getMeUser } from '@/shared/utilities/getMeUser'
import { HeaderClient } from './Component.client'
import { Profile } from '@/entities/profile/_domain/profile'

export async function Header() {
  const headerData: HeaderType = await getCachedGlobal('header', 1)()
  const { user } = await getMeUser()

  const headerUser: Profile = {
    id: user ? (user.id as number) : null,
    username: user?.username ?? null,
  }

  return <HeaderClient data={headerData} user={headerUser} />
}
