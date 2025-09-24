'use client'
import { useHeaderTheme } from '@/shared/providers/HeaderTheme'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav/header-nav'
import { MenuIcon, SearchIcon, XIcon } from 'lucide-react'
import { cn } from '@/shared/utilities/ui'
import { MobileNav } from './Nav/mobile-nav'
import { CartIcon } from './_ui/cart-icon'
import Link from 'next/link'

interface HeaderClientProps {
  data: Header
  userId?: number | null
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, userId }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
    // <header className="container relative z-20   " {...(theme ? { 'data-theme': theme } : {})}>
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container">
        <div className="py-3 flex justify-between">
          <div className="w-full flex items-center justify-between gap-x-8">
            {/* Мобильное меню (бургер) */}
            <button
              className="z-50 p-2 lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Меню"
            >
              {isOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
            <div className="hidden sm:flex">
              <Logo />
            </div>
            <div className="flex sm:hidden items-center gap-5">
              <Link href="/search">
                <span className="sr-only">Search</span>
                <SearchIcon className="w-5 text-primary" />
              </Link>
              <CartIcon />
            </div>
            {/* Логотип */}
          </div>
          {/* Десктопное меню */}
          <HeaderNav data={data} pathname={pathname} userId={userId} />

          {/* Мобильное меню (контент) */}
          <div
            className={cn(
              'bg-background fixed inset-0 z-40 max-w-[90%] transform pt-20 transition-all duration-500 md:w-[550px]',
              'lg:hidden',
              isOpen ? 'translate-x-0' : '-translate-x-full',
            )}
          >
            <MobileNav data={data} onClose={() => setIsOpen(false)} />
          </div>
        </div>
      </div>
    </header>
  )
}
