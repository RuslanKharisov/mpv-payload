'use client'

import React, { useState } from 'react'
import { useConfig, toast, useAuth } from '@payloadcms/ui'
import { Button } from '@/shared/ui/button'
import { useRouter } from 'next/navigation'

export default function RecalculateCountsButton() {
  const router = useRouter()
  const { config } = useConfig()
  const [isLoading, setIsLoading] = useState(false)

  const { user } = useAuth()
  const isSuperAdmin = user?.roles?.includes('super-admin')

  // Скрываем кнопку, если роль не подтверждена.
  if (!isSuperAdmin) return null

  const serverURL = config.serverURL
  const api = config.routes?.api || '/api'

  const handleRecalculate = async () => {
    setIsLoading(true)

    try {
      const res = await fetch(`${serverURL}${api}/recalculate-counts`, {
        method: 'POST',
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Ошибка сервера')
      }

      // Вызываем успех
      toast.success(`✅ ${data.message}`)
      router.refresh()
    } catch (err: any) {
      console.error(err)
      toast.error(`❌ Ошибка: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ marginBottom: '2rem' }}>
      <Button onClick={handleRecalculate} disabled={isLoading} variant="outline" size="sm">
        {isLoading ? 'Синхронизация...' : '🔄 Синхронизировать счетчики'}
      </Button>
    </div>
  )
}
