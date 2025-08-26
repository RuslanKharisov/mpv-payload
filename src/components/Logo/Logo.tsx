import { LogoNew } from '@/shared/icons/logo-icon'
import Link from 'next/link'
import React from 'react'

export const Logo = () => {
  return (
    <Link className="flex items-center space-x-2" href="/">
      <LogoNew className="h-12 w-12" />
      <span className="inline-block font-bold">Prom-Stock</span>
    </Link>
  )
}
