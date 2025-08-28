'use client'
import React, { useEffect } from 'react'
import { TextFieldClientProps } from 'payload'
import { useField, TextInput, FieldLabel, useFormFields } from '@payloadcms/ui'

import { formatSku } from './formatSku'

type SkuComponentProps = {
  fieldToUse: string
} & TextFieldClientProps

export const SkuNormalizedComponent: React.FC<SkuComponentProps> = ({
  field,
  fieldToUse,
  path,
  readOnly: readOnlyFromProps,
}) => {
  const { label } = field

  const { value, setValue } = useField<string>({ path: path || field.name })

  // слушаем поле sku
  const targetFieldValue = useFormFields(([fields]) => {
    return fields[fieldToUse]?.value as string
  })

  useEffect(() => {
    if (targetFieldValue) {
      const formatted = formatSku(targetFieldValue)
      if (value !== formatted) setValue(formatted)
    } else {
      if (value !== '') setValue('')
    }
  }, [targetFieldValue, value, setValue])

  return (
    <div className="field-type sku-field-component">
      <FieldLabel htmlFor={`field-${path}`} label={label} />
      <TextInput
        value={value}
        onChange={setValue}
        path={path || field.name}
        readOnly={Boolean(readOnlyFromProps ?? true)} // обычно только для просмотра
      />
    </div>
  )
}
