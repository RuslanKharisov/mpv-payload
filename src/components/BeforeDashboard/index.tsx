import { Banner } from '@payloadcms/ui/elements/Banner'
import React from 'react'

import { SeedButton } from './SeedButton'
import './index.scss'
import { getMeUser } from '@/shared/utilities/getMeUser'
import { isSuperAdmin } from '@/payload/access/isSuperAdmin'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = async () => {
  const { user } = await getMeUser()

  if (!user) {
    return <div>Loading...</div>
  }

  const permitted = isSuperAdmin(user)

  if (!permitted) {
    return (
      <div>
        <Banner className={`${baseClass}__banner`} type="success">
          <h4>Уважаемый {user.username}, добро пожаловать в панель управления!</h4>
        </Banner>
      </div>
    )
  }

  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>Уважаемый {user.username}, добро пожаловать в панель управления!</h4>
      </Banner>
      <SeedButton />
    </div>
  )
}

export default BeforeDashboard
