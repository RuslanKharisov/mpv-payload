import { LogoIcon } from '@/shared/icons/logo-icon'
import { cn } from '@/shared/ui/utils'
import Link from 'next/link'
import React, { memo } from 'react'

interface LogoProps {
  className?: string
}

export const Logo = memo(({ className }: LogoProps) => {
  return (
    <Link className={cn('flex justify-center items-center space-x-2', className)} href="/">
      <LogoIcon className="h-12 w-12" />
      <span className="inline-block font-bold">Prom-Stock</span>
    </Link>
  )
})

Logo.displayName = 'Logo'
