'use client'

import React, { useState } from 'react'
import { useConfig, toast, useAuth } from '@payloadcms/ui'
import { Button } from '@/shared/ui/button'
import { useRouter } from 'next/navigation'
import { isHidden } from '@/payload/access/isHidden'

export default function RecalculateCountsButton() {
  const router = useRouter()
  const { config } = useConfig()
  const [isLoading, setIsLoading] = useState(false)

  const { user } = useAuth()
  if (!isHidden(user)) return null

  const serverURL = config.serverURL
  const api = config.routes?.api || '/api'

  const handleRecalculate = async () => {
    setIsLoading(true)

    try {
      const res = await fetch(`${serverURL}${api}/recalculate-counts`, {
        method: 'POST',
      })

      const data: { message: string; error?: string } = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Ошибка сервера')
      }

      // Вызываем успех
      toast.success(`✅ ${data.message}`)
      router.refresh()
    } catch (err: unknown) {
      console.error(err)
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка'
      toast.error(`❌ Ошибка: ${errorMessage}`)
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
