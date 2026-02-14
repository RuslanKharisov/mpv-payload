'use client'

import { updateRemoteConfig } from '@/entities/tenant/api/update-remote-config'
import { Tenant } from '@/payload-types'
import { useTRPC } from '@/shared/trpc/client'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { useQuery } from '@tanstack/react-query'
import { ExternalLink, Loader2, Save } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { GoogleStock } from '../remote-stocks-result/_ui/google-stock'

type GoogleSheetsConfigProps = {
  supplier: Tenant
}

export function GoogleSheetsConfig({ supplier }: GoogleSheetsConfigProps) {
  const [isSaving, setIsSaving] = useState(false)
  const trpc = useTRPC()
  const searchParams = useSearchParams()

  // Пагинация из URL
  const page = useMemo(() => Number(searchParams.get('page')) || 1, [searchParams])
  const perPage = useMemo(() => Number(searchParams.get('perPage')) || 5, [searchParams])

  // Локальные поля для формы
  const [tempApiUrl, setTempApiUrl] = useState(supplier.apiUrl || '')
  const [tempApiToken, setTempApiToken] = useState(supplier.apiToken || '')

  const hasSavedConfig = !!supplier.apiUrl && !!supplier.apiToken

  // tRPC-запрос с placeholderData, без прямого fetch
  const remoteStocksQueryOptions = trpc.remoteStocks.getByUrl.queryOptions({
    tenantId: supplier.id,
    page,
    perPage,
    filters: { sku: '', description: '' },
  })

  const { data, isFetching } = useQuery({
    ...remoteStocksQueryOptions,
    enabled: hasSavedConfig,
    placeholderData: (previousData) => previousData,
  })

  // Сохранение в Tenant
  const handleSaveConfig = async () => {
    if (!tempApiUrl.trim() || !tempApiToken.trim()) {
      toast.error('Заполните оба поля')
      return
    }

    setIsSaving(true)
    try {
      const formData = new FormData()
      formData.append('apiUrl', tempApiUrl.trim())
      formData.append('apiToken', tempApiToken.trim())
      formData.append('apiType', 'google')

      const result = await updateRemoteConfig(formData)

      if (result.success) {
        toast.success('Сохранено! Обновите страницу для применения настроек.')
      } else {
        toast.error(result.error || 'Ошибка сохранения')
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Настройка внешнего источника
          </CardTitle>
          <CardDescription>Подключите таблицу для синхронизации остатков</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="api-url">URL API *</Label>
              <Input
                id="api-url"
                placeholder="https://script.google.com/macros/s/..."
                value={tempApiUrl}
                onChange={(e) => setTempApiUrl(e.target.value)}
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="api-token">Токен *</Label>
              <Input
                id="api-token"
                type="password"
                placeholder="Токен авторизации"
                value={tempApiToken}
                onChange={(e) => setTempApiToken(e.target.value)}
                disabled={isSaving}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSaveConfig}
              disabled={isSaving || !tempApiUrl || !tempApiToken}
              className="flex-1"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Сохранение...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Сохранить
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {data && data.data && data.data.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Предпросмотр</CardTitle>
            <CardDescription>
              {isFetching
                ? 'Загрузка...'
                : `Показано ${data.data.length} позиций из ${data.meta.total}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GoogleStock dataArray={data.data} count={data.meta.total ?? 0} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
