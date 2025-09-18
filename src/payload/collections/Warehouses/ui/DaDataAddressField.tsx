'use client'

import React, { useCallback, useEffect, useState } from 'react'
// 👇 ИМПОРТИРУЕМ ПРАВИЛЬНЫЙ ХУК
import { useField } from '@payloadcms/ui'
import { DaDataInput } from './DaDataInput'
// import { findOrCreateAddressAction } from '../actions/findOrCreateAddressAction'

type Props = {
  addressRelationPath: string
  selectedAddressDataPath: string
}

const DaDataAddressField: React.FC<Props> = ({ addressRelationPath, selectedAddressDataPath }) => {
  // 👇 ИСПОЛЬЗУЕМ ХУК useField.
  // Он предназначен для работы с одним полем и предоставляет и value, и setValue.
  // В качестве generic <string> указываем тип значения поля (ID - это строка).
  const { value: addressId, setValue } = useField<string>({ path: addressRelationPath })

  const { setValue: setSelectedAddress } = useField<object>({ path: selectedAddressDataPath })

  const [initialDisplayValue, setInitialDisplayValue] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Этот эффект, как и раньше, подгружает текстовое представление адреса при инициализации формы
  useEffect(() => {
    if (addressId && typeof addressId === 'string' && !initialDisplayValue) {
      setIsLoading(true)
      const fetchAddress = async () => {
        try {
          // Запрашиваем полный адрес с сервера по его ID.
          // Убедитесь, что у вас настроен такой эндпоинт в Payload, либо используйте payload.findByID на сервере через action.
          // Для простоты оставим fetch.
          const response = await fetch(`/api/addresses/${addressId}`)
          if (response.ok) {
            const data = await response.json()
            setInitialDisplayValue(data.fullAddress || '')
          }
        } catch (error) {
          console.error('Failed to fetch initial address', error)
        } finally {
          setIsLoading(false)
        }
      }
      fetchAddress()
    } else {
      setIsLoading(false)
    }
  }, [addressId, initialDisplayValue])

  const handleSelect = useCallback(
    (suggestion: any) => {
      if (setSelectedAddress) {
        // Просто кладем весь объект suggestion в наше временное поле.
        // Payload автоматически обработает его как JSON.
        setSelectedAddress(suggestion)
      }
    },
    [setSelectedAddress],
  )

  if (isLoading) {
    return <div>Загрузка адреса...</div>
  }

  return (
    <DaDataInput
      onSelect={handleSelect}
      initialValue={initialDisplayValue}
      key={addressId || 'new'}
    />
  )
}

export default DaDataAddressField
