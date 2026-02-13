'use client'

import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { SidebarTrigger } from '@/shared/ui/sidebar'
import { Bell } from 'lucide-react'
import { Separator } from '@/shared/ui/separator'

export function PrivateHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h1 className="text-base font-semibold md:text-lg">Дашборд проектов</h1>

        <div className="flex items-center justify-end gap-2 grow py-1">
          <div className="hidden items-center gap-2 md:flex">
            <Input placeholder="Поиск по контрактам..." className="h-10 w-50 lg:w-65" />
          </div>
          <Button variant="ghost" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          {/* Аватар клиента */}
        </div>
      </div>
    </header>
  )
}
