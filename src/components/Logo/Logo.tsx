import { LogoIcon } from '@/shared/icons/logo-icon'
import { cn } from '@/shared/ui/utils'
import Link from 'next/link'
import React, { memo } from 'react'

interface LogoProps {
  className?: string
  onClick?: () => void
}

export const Logo = memo(({ className, onClick }: LogoProps) => {
  return (
    <Link
      href="/"
      onClick={onClick}
      className={cn('flex justify-center items-center space-x-2', className)}
    >
      <LogoIcon className="h-12 w-12" />
      <span className="inline-block font-bold">Пром-Сток | Prom-Stock</span>
    </Link>
  )
})

Logo.displayName = 'Logo'
