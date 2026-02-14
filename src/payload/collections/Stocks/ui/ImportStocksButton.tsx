'use client'

import React, { useState, useCallback, useRef } from 'react'
import { useConfig } from '@payloadcms/ui'
import { type BeforeListTableClientProps } from 'payload'
import { Button } from '@/shared/ui/button'
import { useRouter } from 'next/navigation'

export default function ImportStocksButton(props: BeforeListTableClientProps) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const { config } = useConfig()
  const [isLoading, setIsLoading] = useState(false)
  const [importResult, setImportResult] = useState<{
    successMessage: string
    errors: string[]
  } | null>(null)

  const serverURL = config.serverURL
  const api = config.routes?.api || '/api'

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      setImportResult(null)
      const file = event.target.files?.[0]
      if (!file) return

      setIsLoading(true)
      const formData = new FormData()
      formData.append('file', file)

      let result: any = {}
      try {
        const response = await fetch(`${serverURL}${api}/import-stocks`, {
          method: 'POST',
          body: formData,
        })
        result = await response.json()
      } catch (error: any) {
        result.errors = [error.message || 'Критическая ошибка. Проверьте консоль сервера.']
      } finally {
        setIsLoading(false)
        if (inputRef.current) {
          inputRef.current.value = ''
        }
        setImportResult({
          successMessage: result.message,
          errors: result.errors || [],
        })
        router.refresh()
      }
    },
    [serverURL, api, router],
  )

  const handleClearResults = () => {
    setImportResult(null)
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  if (!props.hasCreatePermission) return null

  return (
    <div style={{ margin: ' 2rem 0' }}>
      <input
        type="file"
        accept=".xlsx, application/vnd.openxmlformats-officedocument-spreadsheetml.sheet"
        ref={inputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
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

      {importResult && (
        <div
          style={{
            marginTop: '1rem',
            border: '1px solid #E1E5E9',
            borderRadius: '4px',
            padding: '1rem',
          }}
        >
          {/* ----- ИЗМЕНЕНИЕ ЗДЕСЬ ----- */}
          {/* Показываем блок успеха, если НЕТ ОШИБОК */}
          {importResult.errors.length === 0 && (
            <div
              style={{
                backgroundColor: '#7BE5B8',
                padding: '10px',
                borderRadius: '4px',
                color: '#000',
              }}
            >
              <p>
                ✅ <strong>{importResult.successMessage}</strong>.
              </p>
            </div>
          )}

          {/* Блок с ошибками (остается без изменений) */}
          {importResult.errors.length > 0 && (
            <div
              style={{
                backgroundColor: '#F9A7A4',
                padding: '10px',
                borderRadius: '4px',
                marginTop: '10px',
                color: '#000',
              }}
            >
              <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                ❌ Обнаружены ошибки ({importResult.errors.length}):
              </p>
              {importResult.errors.map((err, index) => (
                <p key={index} style={{ fontSize: '14px', marginLeft: '10px' }}>
                  - {err}
                </p>
              ))}
            </div>
          )}

          <Button onClick={handleClearResults} style={{ marginTop: '1rem' }}>
            Закрыть отчет
          </Button>
        </div>
      )}
    </div>
  )
}
