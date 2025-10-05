'use client'

import React from 'react'
import { DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/button'
import { ScrollArea } from '@/shared/ui/scroll-area'

type Props = {
  successCount: number
  errors: string[]
  onClose: () => void
}

export const ImportResultModal: React.FC<Props> = ({ successCount, errors, onClose }) => {
  const hasErrors = errors.length > 0

  return (
    <>
      <DialogHeader>
        <DialogTitle>Результаты импорта</DialogTitle>
        <DialogDescription>
          ✅ Успешно обработано: <strong>{successCount}</strong> записей.
        </DialogDescription>
      </DialogHeader>
      {hasErrors && (
        <div className="my-4">
          <p className="text-sm font-medium text-destructive mb-2">
            ❌ Обнаружены ошибки: <strong>{errors.length}</strong> записей.
          </p>
          <ScrollArea className="h-48 w-full rounded-md border p-4">
            <ul className="space-y-2">
              {errors.map((error, i) => (
                <li key={i} className="text-sm">
                  {error}
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>
      )}

      <DialogFooter>
        <Button onClick={onClose}>Закрыть</Button>
      </DialogFooter>
    </>
  )
}
