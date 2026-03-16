'use client'

import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { logoutAction } from '../model/logout-action'
import { Typography } from '@/shared/ui/typography'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/utilities/ui'

type LogoutButtonProps = {
  className?: string
}

export function LogoutButton({ className }: LogoutButtonProps) {
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
    <Button
      // type="button"
      variant="ghost"
      onClick={handleLogout}
      disabled={isPending}
      className={cn(
        `flex items-center justify-start gap-4 cursor-pointer transition-opacity ${
          isPending ? 'opacity-50' : 'hover:text-primary'
        }`,
        className,
      )}
    >
      {isPending ? (
        <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
      ) : (
        <LogOut height={16} />
      )}
      <Typography tag="span" wrapper={false}>
        {isPending ? 'Выходим...' : 'Выход'}
      </Typography>
    </Button>
  )
}
