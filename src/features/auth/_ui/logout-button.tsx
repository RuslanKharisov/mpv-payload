'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { toast } from 'sonner'
import { SidebarMenuButton } from '@/shared/ui/sidebar'
import { logoutAction } from '../model/logout-action'
import { useState } from 'react'

export function LogoutButton() {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  const handleLogout = async () => {
    if (isPending) return
    setIsPending(true)
    try {
      await logoutAction()

      toast.success('Вы успешно вышли из системы')

      // Редирект на страницу входа для клиентов
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Не удалось выйти из системы')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <SidebarMenuButton onClick={handleLogout} className="cursor-pointer">
      <LogOut height={16} />
      <span>Выход</span>
    </SidebarMenuButton>
  )
}
