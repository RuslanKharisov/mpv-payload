'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog'
import { Plus, Loader2 } from 'lucide-react'
import { DaDataAddressInput } from '@/features/dadata-address-input'
import { createNewWarehouse } from '@/entities/warehouse/api/create-new-warehouse'

interface CreateWarehouseFormData {
  name: string
  addressText: string
  addressData: unknown
}

export function CreateWarehouseDialog() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<CreateWarehouseFormData>({
    name: '',
    addressText: '',
    addressData: null,
  })

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      addressText: '',
      addressData: null,
    })
    setError(null)
  }, [])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setTimeout(resetForm, 300)
  }, [resetForm])

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        // Dialog is closing - use handleClose to reset form
        handleClose()
      } else {
        // Dialog is opening
        setIsOpen(true)
      }
    },
    [handleClose],
  )

  const handleAddressChange = useCallback((payload: { text: string; raw: unknown }) => {
    setFormData((prev) => ({
      ...prev,
      addressText: payload.text,
      addressData: payload.raw,
    }))
  }, [])

  const handleSubmit = useCallback(async () => {
    if (!formData.name.trim()) {
      setError('Укажите название склада')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await createNewWarehouse({
        title: formData.name,
        addressText: formData.addressText,
        addressData: formData.addressData,
      })

      if (!result.success) {
        setError(result.error ?? 'Не удалось создать склад')
        return
      }

      handleClose()
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сети. Попробуйте позже.')
    } finally {
      setIsLoading(false)
    }
  }, [formData, handleClose, router])

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Создать склад
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Создание склада</DialogTitle>
          <DialogDescription>
            Заполните данные о новом складе. Адрес используется для отображения в карточках товаров.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="warehouse-name">
              Название склада <span className="text-red-500">*</span>
            </Label>
            <Input
              id="warehouse-name"
              placeholder="Например, Склад №1"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              disabled={isLoading}
            />
          </div>

          {/* Address with DaData */}
          <DaDataAddressInput
            label="Адрес склада"
            value={formData.addressText}
            onChange={handleAddressChange}
            disabled={isLoading}
          />

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Отмена
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Создание...
              </>
            ) : (
              'Создать склад'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
