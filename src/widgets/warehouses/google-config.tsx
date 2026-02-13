'use client'

import { StockResponse } from '@/entities/remote-stock/_domain/tstock-response'
import { updateRemoteConfig } from '@/entities/tenant/api/update-remote-config'
import { Tenant } from '@/payload-types'
import { useUser } from '@/shared/providers/UserProvider'
import { useTRPC } from '@/shared/trpc/client'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { ExternalLink, Loader2, RefreshCw, Save } from 'lucide-react'
import { useState, useMemo, useRef } from 'react'
import { toast } from 'sonner'
import { GoogleStock } from '../remote-stocks-result/_ui/google-stock'
import { Spinner } from '@/shared/ui/spinner'

export function GoogleSheetsConfig() {
  const [isSaving, setIsSaving] = useState(false)
  const user = useUser()
  const trpc = useTRPC()
  const searchParams = useSearchParams()

  const supplier = user.tenants?.[0]?.tenant as Tenant | undefined

  if (!supplier) {
    return <div>Поставщик не зарегистрирован или не закреплен</div>
  }

  // Читаем параметры из URL
  const page = useMemo(() => Number(searchParams.get('page')) || 1, [searchParams])
  const perPage = useMemo(() => Number(searchParams.get('perPage')) || 5, [searchParams])

  // Используем сохранённые значения или пустые строки
  const [tempApiUrl, setTempApiUrl] = useState(supplier.apiUrl || '')
  const [tempApiToken, setTempApiToken] = useState(supplier.apiToken || '')

  // Определяем, есть ли сохранённые данные
  const hasSavedConfig = !!supplier.apiUrl && !!supplier.apiToken

  // Сохраняем последний успешный ответ
  const lastSuccessfulData = useRef<StockResponse | null>(null)

  // Формируем URL с параметрами из URL
  const previewUrl = useMemo(() => {
    if (!hasSavedConfig) return null

    const filters = { sku: '', description: '' }
    const searchQuery = JSON.stringify(filters)

    const url = new URL(supplier.apiUrl!)
    url.searchParams.set('token', supplier.apiToken!)
    url.searchParams.set('page', page.toString())
    url.searchParams.set('per_page', perPage.toString())
    url.searchParams.set('filters', searchQuery)

    return url.toString()
  }, [hasSavedConfig, supplier.apiUrl, supplier.apiToken, page, perPage])

  // Запрос с сохранением предыдущих данных
  const {
    data,
    refetch: refetchPreview,
    isFetching,
  } = useQuery({
    ...trpc.remoteStocks.getByUrl.queryOptions({ url: previewUrl! }),
    enabled: !!previewUrl,
    placeholderData: (previousData) => {
      // Сохраняем и возвращаем предыдущие данные
      if (previousData) {
        lastSuccessfulData.current = previousData
      }
      return previousData
    },
  })

  // Используем данные: новые, или старые если загрузка
  const displayData = data || lastSuccessfulData.current

  // Формируем URL для проверки (из временных полей)
  const buildCheckUrl = () => {
    if (!tempApiUrl.trim() || !tempApiToken.trim()) return null

    const filters = { sku: '', description: '' }
    const searchQuery = JSON.stringify(filters)

    const url = new URL(tempApiUrl.trim())
    url.searchParams.set('token', tempApiToken.trim())
    url.searchParams.set('page', page.toString())
    url.searchParams.set('per_page', perPage.toString())
    url.searchParams.set('filters', searchQuery)

    return url.toString()
  }

  // Проверка подключения
  const handleCheckConnection = async () => {
    if (!tempApiUrl.trim() || !tempApiToken.trim()) {
      toast.error('Заполните оба поля')
      return
    }

    const checkUrl = buildCheckUrl()
    if (!checkUrl) return

    try {
      const result = await refetchPreview()

      // Проверяем наличие ошибки
      if (result.isError || result.error) {
        toast.error('Ошибка подключения: ' + (result.error?.message || 'Неизвестная ошибка'))
        return
      }

      // Проверяем наличие данных
      if (!result.data || !result.data.data) {
        toast.error('Нет данных. Проверьте корректность URL и токена.')
        return
      }

      toast.success('Подключение работает!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка подключения')
    }
  }

  // Сохранение в тенант
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
        toast.success('Сохранено!')
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="api-url">URL API *</Label>
              <Input
                id="api-url"
                placeholder="https://script.google.com/macros/s/...  "
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
              onClick={handleCheckConnection}
              disabled={isSaving || !tempApiUrl || !tempApiToken}
              variant="outline"
              className="flex-1"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Проверить
            </Button>

            <Button
              onClick={handleSaveConfig}
              disabled={isSaving || !tempApiUrl || !tempApiToken}
              className="flex-1"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Сохранение...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Сохранить
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {displayData && displayData.data && displayData.data.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Предпросмотр</CardTitle>
            <CardDescription className="font-bold">
              {isFetching ? (
                <span className="text-destructive flex items-start gap-3">
                  Загрузка ... <Spinner className="w-4 h-4" />{' '}
                </span>
              ) : (
                `Показано ${displayData.data.length} позиций из ${displayData.meta.total}`
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GoogleStock dataArray={displayData.data} count={displayData.meta.total ?? 0} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
