'use client'

import { useState, useCallback, JSX } from 'react'
import { Button } from '@/shared/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog'
import { Loader2, Upload, FileSpreadsheet, X } from 'lucide-react'

interface UploadExcelDialogProps {
  onFinished?: (summary: { successCount: number; errors: string[] }) => void
}

type ImportStatus = 'idle' | 'uploading' | 'processing' | 'done' | 'error'

interface ImportResult {
  success: boolean
  message?: string
  successCount?: number
  errors?: string[]
  error?: string
}

// Helper to format file size for display - defined outside component to avoid re-creation on render
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function UploadExcelDialog({ onFinished }: UploadExcelDialogProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<ImportStatus>('idle')
  // Local result state for display purposes only - not used in handleImport closure
  const [displaySuccessCount, setDisplaySuccessCount] = useState(0)
  const [displayErrors, setDisplayErrors] = useState<string[]>([])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setStatus('idle')
      setDisplayErrors([])
    }
  }, [])

  const handleClearFile = useCallback(() => {
    setFile(null)
    setStatus('idle')
    setDisplayErrors([])
  }, [])

  const resetState = useCallback(() => {
    setFile(null)
    setStatus('idle')
    setDisplaySuccessCount(0)
    setDisplayErrors([])
  }, [])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    // Delay reset to allow animation to complete
    setTimeout(resetState, 300)
  }, [resetState])

  const handleImport = useCallback(async () => {
    if (!file) {
      setDisplayErrors(['Выберите файл для импорта'])
      setStatus('error')
      return
    }

    setStatus('uploading')
    setDisplayErrors([])

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/import-stocks', {
        method: 'POST',
        body: formData,
      })

      // Check HTTP status before parsing JSON to avoid errors on non-JSON responses
      if (res.status === 401) {
        const errorMsg = 'Нет доступа к импорту. Проверьте авторизацию.'
        setDisplayErrors([errorMsg])
        setStatus('error')
        onFinished?.({ successCount: 0, errors: [errorMsg] })
        return
      }

      if (!res.ok) {
        // Try to parse error details from JSON, fallback to status text
        let errorList: string[]
        try {
          const errorJson = await res.json()
          errorList = errorJson.errors ?? [
            errorJson.error ?? errorJson.message ?? 'Неизвестная ошибка',
          ]
        } catch {
          errorList = [`Ошибка сервера: ${res.status} ${res.statusText}`]
        }
        setDisplayErrors(errorList)
        setDisplaySuccessCount(0)
        setStatus('error')
        onFinished?.({ successCount: 0, errors: errorList })
        return
      }

      // Only parse JSON for successful responses
      const json: ImportResult = await res.json()

      if (json.success === false) {
        const errorList = json.errors ?? [json.error ?? json.message ?? 'Неизвестная ошибка']
        const finalSuccessCount = json.successCount ?? 0
        setDisplayErrors(errorList)
        setDisplaySuccessCount(finalSuccessCount)
        setStatus('error')
        onFinished?.({ successCount: finalSuccessCount, errors: errorList })
        return
      }

      // Success
      const count = json.successCount ?? 0
      setDisplaySuccessCount(count)
      setDisplayErrors([])
      setStatus('done')

      onFinished?.({ successCount: count, errors: [] })
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Ошибка сети. Попробуйте позже.'
      setDisplayErrors([errorMsg])
      setStatus('error')
      onFinished?.({ successCount: 0, errors: [errorMsg] })
    }
  }, [file, onFinished])

  const isLoading = status === 'uploading' || status === 'processing'

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) setTimeout(resetState, 300)
      }}
    >
      <DialogTrigger asChild>
        <Button variant="destructive" className="w-full md:w-fit gap-2 cursor-pointer">
          <Upload className="h-4 w-4" />
          Импорт из Excel
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Импорт остатков из Excel
          </DialogTitle>
          <DialogDescription>
            Загрузите файл Excel (.xlsx) с данными об остатках. Файл будет обработан и данные
            добавлены в базу.
          </DialogDescription>
          <p className="mt-2 text-xs text-muted-foreground">
            Шаблон файла для импорта вы можете скачать по ссылке{' '}
            <a
              href="/files/import-stocks-template.xlsx"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-blue-600"
            >
              скачать шаблон
            </a>
            .
          </p>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* File Input */}
          {status === 'idle' || status === 'error' ? (
            <div className="space-y-2">
              {!file ? (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors">
                  <input
                    type="file"
                    id="excel-file"
                    accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="excel-file"
                    className="group flex flex-col items-center gap-2 cursor-pointer"
                  >
                    <Upload className="h-8 w-8 text-muted-foreground group-hover:text-blue-600" />
                    <span className="text-sm text-muted-foreground group-hover:text-blue-600">
                      Нажмите для выбора файла
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Поддерживается формат .xlsx
                    </span>
                  </label>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-sm font-medium truncate max-w-50">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleClearFile} disabled={isLoading}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ) : null}

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-sm font-medium">
                {status === 'uploading' ? 'Загрузка файла...' : 'Обработка файла...'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Пожалуйста, не закрывайте окно</p>
            </div>
          )}

          {/* Success State */}
          {status === 'done' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-700">
                <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-sm">✓</span>
                </div>
                <p className="font-medium">Успешно импортировано {displaySuccessCount} записей</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && displayErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="font-medium text-red-700 mb-2">
                {displaySuccessCount > 0
                  ? `Импорт завершен с ошибками. Успешно: ${displaySuccessCount}`
                  : 'Ошибка импорта'}
              </p>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {displayErrors.map((error, index) => (
                  <p key={index} className="text-sm text-red-600">
                    • {error}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          {status === 'done' || status === 'error' ? (
            <>
              <Button variant="outline" onClick={handleClose}>
                Закрыть
              </Button>
              {status === 'done' && (
                <Button variant="outline" onClick={resetState}>
                  Импортировать ещё
                </Button>
              )}
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleClose} disabled={isLoading}>
                Отмена
              </Button>
              <Button onClick={handleImport} disabled={!file || isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Обработка...
                  </>
                ) : (
                  'Начать импорт'
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
