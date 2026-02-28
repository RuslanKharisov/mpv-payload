'use client'

import { LogoutButton } from '@/features/auth/_ui/logout-button'
import { User } from '@/payload-types'
import { LogoIcon } from '@/shared/icons/logo-icon'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/shared/ui/sidebar'
import { Typography } from '@/shared/ui/typography'
import { Boxes, CreditCard, LayoutDashboard, UserIcon, WarehouseIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const supplierItems = [
  { href: '/suppliers', icon: LayoutDashboard, label: 'Дашборд' },
  { href: '/suppliers/stocks', icon: Boxes, label: 'Складские запасы' },
  { href: '/suppliers/warehouses', icon: WarehouseIcon, label: 'Склады' },
  { href: '/suppliers/billing', icon: CreditCard, label: 'Тариф' },
  // { href: '/suppliers/profile', icon: Building2, label: 'Компания' },
  // { href: '/suppliers/users', icon: Users, label: 'Пользователи' }, ToDo
]

interface PrivateSidebarProps {
  user: User
}

export function PrivateSidebar({ user }: PrivateSidebarProps) {
  const { state } = useSidebar() // "expanded" | "collapsed"
  const pathname = usePathname()
  const iconSize = state == 'expanded' ? '!w-8 !h-auto' : ''

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="border-b">
        <SidebarMenuButton asChild size="lg">
          <Link href="/">
            <LogoIcon className={`${iconSize}`} />
            <Typography tag="span" wrapper={false}>
              Личный кабинет
            </Typography>
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>

      <SidebarContent className="pt-6">
        <SidebarGroup className="pt-0">
          <SidebarMenu>
            {supplierItems.map((item, index) => (
              <SidebarMenuItem key={item.href + index}>
                <SidebarMenuButton asChild isActive={pathname === item.href}>
                  <Link href={item.href}>
                    <item.icon className="h-4 w-4" />
                    <Typography tag="span" wrapper={false}>
                      {item.label}
                    </Typography>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenuButton asChild>
          <Link href="/supplier">
            <UserIcon height={16} />
            <Typography tag="span" wrapper={false}>
              {user?.email}
            </Typography>
          </Link>
        </SidebarMenuButton>
        <LogoutButton />
      </SidebarFooter>
    </Sidebar>
  )
}
