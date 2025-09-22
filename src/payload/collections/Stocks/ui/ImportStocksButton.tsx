'use client'
import { Button } from '@/shared/ui/button'
import { useConfig } from '@payloadcms/ui'
import React, { useState, useCallback } from 'react'
import { toast } from 'sonner'

const ImportStocksButton: React.FC = () => {
  const { config } = useConfig()
  const serverURL = config.serverURL
  const api = config.routes?.api || '/api'
  const [isLoading, setIsLoading] = useState(false)

  console.log('serverURL ==> ', serverURL)
  console.log('api ==> ', api)

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      setIsLoading(true)

      const formData = new FormData()
      formData.append('file', file)

      try {
        const response = await fetch(`${serverURL}${api}/import-stocks`, {
          method: 'POST',
          headers: {
            // Payload автоматически подставит куки с токеном аутентификации
          },
          body: formData,
        })

        const result = await response.json()

        if (!response.ok) {
          // Если есть массив ошибок, покажем их
          if (result.errors && Array.isArray(result.errors)) {
            toast.error(`Ошибка импорта: ${result.errors.join('; ')}`)
          } else {
            throw new Error(result.error || 'Произошла ошибка при импорте')
          }
        } else {
          toast.success(result.message || 'Импорт успешно завершен!')
          // Опционально: перезагрузить страницу для обновления данных
          window.location.reload()
        }
      } catch (error: any) {
        toast.error(error.message || 'Не удалось выполнить импорт.')
      } finally {
        setIsLoading(false)
        // Сбрасываем значение input, чтобы можно было загрузить тот же файл снова
        event.target.value = ''
      }
    },
    [serverURL],
  )

  const handleClick = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    input.onchange = (e) => handleFileChange(e as any)
    input.click()
  }

  return (
    <div className="gutter--left gutter--right" style={{ margin: ' 2rem 0' }}>
      <input
        type="file"
        accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="stock-import-input"
      />
      <label htmlFor="stock-import-input">
        <Button variant="default" onClick={handleClick} disabled={isLoading}>
          {isLoading ? 'Загрузка...' : 'Импорт из Excel'}
        </Button>
      </label>
    </div>
  )
}

export default ImportStocksButton
