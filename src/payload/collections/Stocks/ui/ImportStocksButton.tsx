'use client'

import { Button, toast, useConfig } from '@payloadcms/ui'
import { BeforeListTableClientProps } from 'payload'
import React, { useState, useCallback, useEffect, useRef } from 'react'

export default function ImportStocksButton(props: BeforeListTableClientProps) {
  const { config } = useConfig()
  const serverURL = config.serverURL
  const api = config.routes?.api || '/api'
  const [isLoading, setIsLoading] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

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
          body: formData,
        })

        const result = await response.json()

        if (!response.ok || !result.success) {
          toast.error(result.error || 'Неизвестная ошибка')
        } else {
          toast.success(result.message || 'Импорт успешно завершен!')
        }

        setIsLoading(false)
        if (inputRef.current) {
          inputRef.current.value = ''
        }
      } catch (error: any) {
        toast.error(error.message || 'Не удалось выполнить импорт.')
      } finally {
        setIsLoading(false)
      }
    },
    [serverURL],
  )

  const handleClick = () => {
    inputRef.current?.click()
  }

  if (!props.hasCreatePermission) return null

  return (
    <div className="" style={{ margin: ' 2rem 0' }}>
      <input
        type="file"
        accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ref={inputRef}
        onChange={handleFileChange}
        style={{ display: 'none', cursor: 'pointer' }}
        id="stock-import-input"
      />
      <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Button onClick={handleClick} disabled={isLoading}>
          {isLoading ? 'Загрузка...' : 'Импорт из Excel'}
        </Button>
        <a
          href="/import_template.xlsx"
          download
          style={{ fontSize: '12px', textDecoration: 'underline' }}
        >
          Скачать шаблон
        </a>
      </div>
    </div>
  )
}
