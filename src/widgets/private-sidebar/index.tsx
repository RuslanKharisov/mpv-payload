'use client'

// import { LogoutButton } from '@/entities/auth/api/ui/LogoutButton'
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
import {
  Boxes,
  Building2,
  CreditCard,
  Inbox,
  LayoutDashboard,
  UserIcon,
  Users,
  WarehouseIcon,
} from 'lucide-react'
import Link from 'next/link'

const supplierItems = [
  { href: '/suppliers', icon: LayoutDashboard, label: 'Дашборд' },
  { href: '/suppliers/stocks', icon: Boxes, label: 'Товары' },
  { href: '/suppliers/warehouses', icon: WarehouseIcon, label: 'Склады' },
  { href: '/suppliers/requests', icon: Inbox, label: 'Заявки' },
  { href: '/suppliers/billing', icon: CreditCard, label: 'Тариф' },
  { href: '/suppliers/profile', icon: Building2, label: 'Компания' },
  { href: '/suppliers/users', icon: Users, label: 'Пользователи' },
]

interface PrivateSidebarProps {
  user: User
}

export function PrivateSidebar({ user }: PrivateSidebarProps) {
  const { state } = useSidebar() // "expanded" | "collapsed"
  const iconSize = state == 'expanded' ? '!w-8 !h-auto' : ''

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="border-b">
        <SidebarMenuButton asChild size="lg">
          <Link href="/">
            <LogoIcon className={`${iconSize}`} />
            <span>Личный кабинет</span>
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>

      <SidebarContent className="pt-6">
        <SidebarGroup className="pt-0">
          <SidebarMenu>
            {supplierItems.map((item, index) => (
              <SidebarMenuItem key={item.href + index}>
                <SidebarMenuButton asChild>
                  <Link href={item.href}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenuButton asChild>
          <Link href="/clients">
            <UserIcon height={16} />
            <span>{user?.email}</span>
          </Link>
        </SidebarMenuButton>
        <SidebarMenuButton asChild>{/* <LogoutButton /> */}</SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  )
}
