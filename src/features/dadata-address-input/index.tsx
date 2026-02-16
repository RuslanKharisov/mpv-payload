'use client'

import { Label } from '@/shared/ui/label'
import { DaDataInput } from '@/payload/collections/Warehouses/ui/DaDataInput'

interface DaDataAddressInputProps {
  label?: string
  value?: string
  onChange: (payload: { text: string; raw: unknown }) => void
}

export function DaDataAddressInput({
  label = 'Адрес склада',
  value,
  onChange,
}: DaDataAddressInputProps) {
  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <DaDataInput
        initialValue={value}
        onSelect={(suggestion: { value: string; data?: unknown }) => {
          onChange({ text: suggestion.value, raw: suggestion })
        }}
      />
    </div>
  )
}
